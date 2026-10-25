package com.recall.backend.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate; import java.time.LocalDateTime;
@Entity @Table(name="interview_experiences")
public class InterviewExperience {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id",nullable=false) private AppUser user;
 @Column(nullable=false,length=120) private String company;
 @Column(nullable=false,length=120) private String role;
 private LocalDate interviewDate;
 @Column(length=100) private String roundName;
 @Column(length=40) private String outcome;
 @Column(length=120) private String location;
 @Column(length=120) private String experienceLevel;
 @Column(columnDefinition="TEXT") private String questions;
 @Column(columnDefinition="TEXT") private String notes;
 @Column(columnDefinition="TEXT") private String lessonsLearned;
 @Column(nullable=false) private LocalDateTime createdAt=LocalDateTime.now();
 @Column(nullable=false) private LocalDateTime updatedAt=LocalDateTime.now();
 @PreUpdate void touch(){updatedAt=LocalDateTime.now();}
 public InterviewExperience() {}
 public Long getId(){return id;} @JsonIgnore public AppUser getUser(){return user;} public void setUser(AppUser v){user=v;}
 public String getCompany(){return company;} public void setCompany(String v){company=v;} public String getRole(){return role;} public void setRole(String v){role=v;}
 public LocalDate getInterviewDate(){return interviewDate;} public void setInterviewDate(LocalDate v){interviewDate=v;} public String getRoundName(){return roundName;} public void setRoundName(String v){roundName=v;}
 public String getOutcome(){return outcome;} public void setOutcome(String v){outcome=v;} public String getLocation(){return location;} public void setLocation(String v){location=v;}
 public String getExperienceLevel(){return experienceLevel;} public void setExperienceLevel(String v){experienceLevel=v;} public String getQuestions(){return questions;} public void setQuestions(String v){questions=v;}
 public String getNotes(){return notes;} public void setNotes(String v){notes=v;} public String getLessonsLearned(){return lessonsLearned;} public void setLessonsLearned(String v){lessonsLearned=v;}
 public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
