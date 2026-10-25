package com.recall.backend.dto;
import jakarta.validation.constraints.*;
public record RegisterRequest(@NotBlank @Size(min=2,max=80) String name,@NotBlank @Email @Size(max=180) String email,@NotBlank @Size(min=8,max=72) String password) {}
