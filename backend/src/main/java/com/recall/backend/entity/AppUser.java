package com.recall.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="app_users", uniqueConstraints=@UniqueConstraint(columnNames="email"))
public class AppUser {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=80) private String name;
 @Column(nullable=false,length=180,unique=true) private String email;
 @Column(nullable=false) private String passwordHash;
 @Column(nullable=false) private LocalDateTime createdAt=LocalDateTime.now();
 public AppUser() {}
 public Long getId(){return id;} public String getName(){return name;} public void setName(String v){name=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v==null?null:v.trim().toLowerCase();}
 public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String v){passwordHash=v;}
 public LocalDateTime getCreatedAt(){return createdAt;}
}
