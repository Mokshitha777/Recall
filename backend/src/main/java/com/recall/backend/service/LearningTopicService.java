package com.recall.backend.service;
import com.recall.backend.dto.LearningTopicRequest; import com.recall.backend.entity.*; import com.recall.backend.repository.LearningTopicRepository; import org.springframework.http.HttpStatus; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import org.springframework.web.server.ResponseStatusException; import java.util.List;
@Service public class LearningTopicService {
 private final LearningTopicRepository repo; private final AuthService auth; public LearningTopicService(LearningTopicRepository repo,AuthService auth){this.repo=repo;this.auth=auth;}
 public List<LearningTopic> list(String email){return repo.findAllByUserIdOrderByCreatedAtDesc(auth.current(email).getId());}
 public LearningTopic get(String email,Long id){return repo.findByIdAndUserId(id,auth.current(email).getId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Learning topic not found"));}
 @Transactional public LearningTopic create(String email,LearningTopicRequest r){LearningTopic t=new LearningTopic();t.setUser(auth.current(email));apply(t,r);return repo.save(t);}
 @Transactional public LearningTopic update(String email,Long id,LearningTopicRequest r){LearningTopic t=get(email,id);apply(t,r);return repo.save(t);}
 @Transactional public void delete(String email,Long id){repo.delete(get(email,id));}
 private void apply(LearningTopic t,LearningTopicRequest r){t.setTitle(r.title().trim());t.setCategory(r.category());t.setDescription(r.description());if(r.status()!=null)t.setStatus(r.status());if(r.progress()!=null)t.setProgress(r.progress());else if("COMPLETED".equals(r.status()))t.setProgress(100);t.setTargetDate(r.targetDate());t.setNotes(r.notes());}
}
