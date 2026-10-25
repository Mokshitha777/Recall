package com.recall.backend.controller;
import com.recall.backend.dto.InterviewRequest; import com.recall.backend.entity.InterviewExperience; import com.recall.backend.service.InterviewExperienceService; import jakarta.validation.Valid; import org.springframework.http.HttpStatus; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/interviews") public class InterviewExperienceController {
 private final InterviewExperienceService service; public InterviewExperienceController(InterviewExperienceService service){this.service=service;}
 @GetMapping public List<InterviewExperience> list(Authentication a){return service.list(a.getName());}
 @GetMapping("/{id}") public InterviewExperience get(Authentication a,@PathVariable Long id){return service.get(a.getName(),id);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public InterviewExperience create(Authentication a,@Valid @RequestBody InterviewRequest r){return service.create(a.getName(),r);}
 @PutMapping("/{id}") public InterviewExperience update(Authentication a,@PathVariable Long id,@Valid @RequestBody InterviewRequest r){return service.update(a.getName(),id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Authentication a,@PathVariable Long id){service.delete(a.getName(),id);}
}
