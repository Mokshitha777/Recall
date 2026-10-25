package com.recall.backend.dto;
import jakarta.validation.constraints.*; import java.time.LocalDateTime;
public record LearningTopicRequest(@NotBlank @Size(max=160) String title,@Size(max=80) String category,String description,@Pattern(regexp="NOT_STARTED|IN_PROGRESS|COMPLETED",message="status must be NOT_STARTED, IN_PROGRESS, or COMPLETED") String status,@Min(0) @Max(100) Integer progress,LocalDateTime targetDate,String notes) {}
