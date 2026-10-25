
package com.recall.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class AiCoachService {

 private final String apiKey;
 private final String model;
 private final String baseUrl;
 private final ObjectMapper mapper;

 public AiCoachService(
         @Value("${app.ai.api-key:}") String apiKey,
         @Value("${app.ai.model:gpt-4o-mini}") String model,
         @Value("${app.ai.base-url:https://api.openai.com/v1}") String baseUrl,
         ObjectMapper mapper) {
  this.apiKey = apiKey;
  this.model = model;
  this.baseUrl = baseUrl;
  this.mapper = mapper;
 }

 public boolean configured() {
  return apiKey != null && !apiKey.isBlank();
 }

 public String coach(
         String task,
         String content,
         String company,
         String role,
         String round) {

  if (!configured()) {
   throw new ResponseStatusException(
           HttpStatus.SERVICE_UNAVAILABLE,
           "AI is not configured. Set AI_API_KEY."
   );
  }

  String prompt = """
                You are Recall, an interview learning coach.
                Be practical, structured, honest, and concise.
                Do not invent facts from the user's notes.

                Task: %s
                Company: %s
                Role: %s
                Round: %s

                User material:
                %s
                """.formatted(
          safe(task),
          safe(company),
          safe(role),
          safe(round),
          safe(content)
  );

  try {
   RestClient client = RestClient.builder()
           .baseUrl(baseUrl)
           .defaultHeader(
                   HttpHeaders.AUTHORIZATION,
                   "Bearer " + apiKey
           )
           .defaultHeader(
                   HttpHeaders.CONTENT_TYPE,
                   MediaType.APPLICATION_JSON_VALUE
           )
           .build();

   Map<String, Object> requestBody = Map.of(
           "model", model,
           "messages", List.of(
                   Map.of(
                           "role", "system",
                           "content", "You help users learn from interview rounds."
                   ),
                   Map.of(
                           "role", "user",
                           "content", prompt
                   )
           ),
           "temperature", 0.4
   );

   String raw = client.post()
           .uri("/chat/completions")
           .body(requestBody)
           .retrieve()
           .body(String.class);

   JsonNode root = mapper.readTree(raw);
   JsonNode response = root.path("choices")
           .path(0)
           .path("message")
           .path("content");

   if (response.isMissingNode() || response.asText().isBlank()) {
    throw new IllegalStateException(
            "AI provider returned an empty response"
    );
   }

   return response.asText();

  } catch (ResponseStatusException e) {
   throw e;
  } catch (Exception e) {
   throw new ResponseStatusException(
           HttpStatus.BAD_GATEWAY,
           "AI request failed. Check your API key, model, URL, and network."
   );
  }
 }

 private String safe(String value) {
  return value == null ? "Not provided" : value;
 }
}
