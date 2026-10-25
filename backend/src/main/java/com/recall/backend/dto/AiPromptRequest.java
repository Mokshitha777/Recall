package com.recall.backend.dto;
import jakarta.validation.constraints.*;
public record AiPromptRequest(@NotBlank @Size(max=12000) String content,@Size(max=120) String company,@Size(max=120) String role,@Size(max=100) String roundName) {}
