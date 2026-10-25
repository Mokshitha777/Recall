package com.recall.backend.controller;
import com.recall.backend.dto.*; import com.recall.backend.service.AuthService; import jakarta.validation.Valid; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/auth") public class AuthController {
 private final AuthService service; public AuthController(AuthService service){this.service=service;}
 @PostMapping("/register") public AuthResponse register(@Valid @RequestBody RegisterRequest r){return service.register(r);}
 @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest r){return service.login(r);}
 @GetMapping("/me") public Map<String,Object> me(Authentication a){var u=service.current(a.getName());return Map.of("id",u.getId(),"name",u.getName(),"email",u.getEmail(),"createdAt",u.getCreatedAt());}
}
