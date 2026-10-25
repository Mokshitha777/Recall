package com.recall.backend.controller;
import com.recall.backend.repository.*; import com.recall.backend.service.AuthService; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/dashboard") public class DashboardController {
 private final AuthService auth; private final InterviewExperienceRepository interviews; private final LearningTopicRepository topics;
 public DashboardController(AuthService auth,InterviewExperienceRepository interviews,LearningTopicRepository topics){this.auth=auth;this.interviews=interviews;this.topics=topics;}
 @GetMapping public Map<String,Object> summary(Authentication a){Long id=auth.current(a.getName()).getId();var allTopics=topics.findAllByUserIdOrderByCreatedAtDesc(id);return Map.of("interviewCount",interviews.findAllByUserIdOrderByInterviewDateDesc(id).size(),"learningTopicCount",allTopics.size(),"completedTopics",allTopics.stream().filter(t->"COMPLETED".equals(t.getStatus())).count(),"inProgressTopics",allTopics.stream().filter(t->"IN_PROGRESS".equals(t.getStatus())).count());}
}
