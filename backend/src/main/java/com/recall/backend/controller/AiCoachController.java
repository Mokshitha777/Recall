package com.recall.backend.controller;
import com.recall.backend.dto.AiPromptRequest; import com.recall.backend.service.AiCoachService; import jakarta.validation.Valid; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/ai") public class AiCoachController {
 private final AiCoachService ai; public AiCoachController(AiCoachService ai){this.ai=ai;}
 @GetMapping("/health") public Map<String,Object> health(){return Map.of("available",ai.configured(),"message",ai.configured()?"AI is configured":"AI key is not configured; set AI_API_KEY locally");}
 @PostMapping("/analyze-interview") public Map<String,String> analyze(Authentication a,@Valid @RequestBody AiPromptRequest r){return Map.of("result",ai.coach("Analyze this interview experience. Extract strengths, gaps, actionable lessons, and a short practice plan.",r.content(),r.company(),r.role(),r.roundName()));}
 @PostMapping("/generate-questions") public Map<String,String> questions(Authentication a,@Valid @RequestBody AiPromptRequest r){return Map.of("result",ai.coach("Generate 8 relevant practice questions based on the interview details. Group by fundamentals, practical problem solving, and behavioral questions. Include concise answer guidance.",r.content(),r.company(),r.role(),r.roundName()));}
 @PostMapping("/study-plan") public Map<String,String> plan(Authentication a,@Valid @RequestBody AiPromptRequest r){return Map.of("result",ai.coach("Create a realistic 7-day learning plan from the user's interview gaps. Each day should have a goal, practice task, and self-check.",r.content(),r.company(),r.role(),r.roundName()));}
}
