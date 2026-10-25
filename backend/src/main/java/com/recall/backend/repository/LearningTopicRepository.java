package com.recall.backend.repository;
import com.recall.backend.entity.LearningTopic; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List; import java.util.Optional;
public interface LearningTopicRepository extends JpaRepository<LearningTopic,Long>{ List<LearningTopic> findAllByUserIdOrderByCreatedAtDesc(Long userId); Optional<LearningTopic> findByIdAndUserId(Long id,Long userId); }
