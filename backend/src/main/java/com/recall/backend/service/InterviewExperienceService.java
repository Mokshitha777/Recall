package com.recall.backend.service;
import com.recall.backend.dto.InterviewRequest; import com.recall.backend.entity.*; import com.recall.backend.repository.InterviewExperienceRepository; import org.springframework.http.HttpStatus; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import org.springframework.web.server.ResponseStatusException; import java.util.List;
@Service public class InterviewExperienceService {
 private final InterviewExperienceRepository repo; private final AuthService auth;
 public InterviewExperienceService(InterviewExperienceRepository repo,AuthService auth){this.repo=repo;this.auth=auth;}
 public List<InterviewExperience> list(String email){return repo.findAllByUserIdOrderByInterviewDateDesc(auth.current(email).getId());}
 public InterviewExperience get(String email,Long id){return repo.findByIdAndUserId(id,auth.current(email).getId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Interview experience not found"));}
 @Transactional public InterviewExperience create(String email,InterviewRequest r){InterviewExperience e=new InterviewExperience();e.setUser(auth.current(email));apply(e,r);return repo.save(e);}
 @Transactional public InterviewExperience update(String email,Long id,InterviewRequest r){InterviewExperience e=get(email,id);apply(e,r);return repo.save(e);}
 @Transactional public void delete(String email,Long id){InterviewExperience e=get(email,id);repo.delete(e);}
 private void apply(InterviewExperience e,InterviewRequest r){e.setCompany(r.company().trim());e.setRole(r.role().trim());e.setInterviewDate(r.interviewDate());e.setRoundName(r.roundName());e.setOutcome(r.outcome());e.setLocation(r.location());e.setExperienceLevel(r.experienceLevel());e.setQuestions(r.questions());e.setNotes(r.notes());e.setLessonsLearned(r.lessonsLearned());}
}
