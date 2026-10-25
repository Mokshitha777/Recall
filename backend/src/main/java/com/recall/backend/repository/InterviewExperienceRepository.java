package com.recall.backend.repository;
import com.recall.backend.entity.InterviewExperience; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List; import java.util.Optional;
public interface InterviewExperienceRepository extends JpaRepository<InterviewExperience,Long>{ List<InterviewExperience> findAllByUserIdOrderByInterviewDateDesc(Long userId); Optional<InterviewExperience> findByIdAndUserId(Long id,Long userId); }
