package com.recall.backend.service;
import com.recall.backend.dto.*; import com.recall.backend.entity.AppUser; import com.recall.backend.repository.AppUserRepository; import com.recall.backend.security.JwtService; import org.springframework.http.HttpStatus; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import org.springframework.web.server.ResponseStatusException;
@Service public class AuthService {
 private final AppUserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthService(AppUserRepository users,PasswordEncoder encoder,JwtService jwt){this.users=users;this.encoder=encoder;this.jwt=jwt;}
 @Transactional public AuthResponse register(RegisterRequest r){String email=r.email().trim().toLowerCase(); if(users.existsByEmailIgnoreCase(email))throw new ResponseStatusException(HttpStatus.CONFLICT,"An account with this email already exists"); AppUser u=new AppUser();u.setName(r.name().trim());u.setEmail(email);u.setPasswordHash(encoder.encode(r.password()));u=users.save(u);return response(u);}
 public AuthResponse login(LoginRequest r){AppUser u=users.findByEmailIgnoreCase(r.email().trim()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password"));if(!encoder.matches(r.password(),u.getPasswordHash()))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password");return response(u);}
 public AppUser current(String email){return users.findByEmailIgnoreCase(email).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"User not found"));}
 private AuthResponse response(AppUser u){return new AuthResponse(jwt.generate(u.getEmail()),"Bearer",u.getId(),u.getName(),u.getEmail());}
}
