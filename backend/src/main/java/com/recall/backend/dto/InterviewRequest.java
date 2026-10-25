package com.recall.backend.dto;
import jakarta.validation.constraints.*; import java.time.LocalDate;
public record InterviewRequest(@NotBlank @Size(max=120) String company,@NotBlank @Size(max=120) String role,LocalDate interviewDate,@Size(max=100) String roundName,@Size(max=40) String outcome,@Size(max=120) String location,@Size(max=120) String experienceLevel,String questions,String notes,String lessonsLearned) {}
