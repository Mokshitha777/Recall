package com.recall.backend.controller;
import com.recall.backend.dto.LearningTopicRequest; import com.recall.backend.entity.LearningTopic; import com.recall.backend.service.LearningTopicService; import jakarta.validation.Valid; import org.springframework.http.HttpStatus; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/learning-topics") public class LearningTopicController {
 private final LearningTopicService service; public LearningTopicController(LearningTopicService service){this.service=service;}
 @GetMapping public List<LearningTopic> list(Authentication a){return service.list(a.getName());}
 @GetMapping("/{id}") public LearningTopic get(Authentication a,@PathVariable Long id){return service.get(a.getName(),id);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public LearningTopic create(Authentication a,@Valid @RequestBody LearningTopicRequest r){return service.create(a.getName(),r);}
 @PutMapping("/{id}") public LearningTopic update(Authentication a,@PathVariable Long id,@Valid @RequestBody LearningTopicRequest r){return service.update(a.getName(),id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Authentication a,@PathVariable Long id){service.delete(a.getName(),id);}
}
