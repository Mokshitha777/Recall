package com.recall.backend.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore; import java.time.LocalDateTime;
@Entity @Table(name="learning_topics")
public class LearningTopic {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id",nullable=false) private AppUser user;
 @Column(nullable=false,length=160) private String title;
 @Column(length=80) private String category;
 @Column(columnDefinition="TEXT") private String description;
 @Column(nullable=false,length=30) private String status="NOT_STARTED";
 @Column(nullable=false) private Integer progress=0;
 private LocalDateTime targetDate;
 @Column(columnDefinition="TEXT") private String notes;
 @Column(nullable=false) private LocalDateTime createdAt=LocalDateTime.now();
 @Column(nullable=false) private LocalDateTime updatedAt=LocalDateTime.now();
 @PreUpdate void touch(){updatedAt=LocalDateTime.now();}
 public LearningTopic(){} public Long getId(){return id;} @JsonIgnore public AppUser getUser(){return user;} public void setUser(AppUser v){user=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getCategory(){return category;} public void setCategory(String v){category=v;}
 public String getDescription(){return description;} public void setDescription(String v){description=v;} public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public Integer getProgress(){return progress;} public void setProgress(Integer v){progress=v;} public LocalDateTime getTargetDate(){return targetDate;} public void setTargetDate(LocalDateTime v){targetDate=v;}
 public String getNotes(){return notes;} public void setNotes(String v){notes=v;} public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
