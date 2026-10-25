package com.recall.backend.security;
import io.jsonwebtoken.Jwts; import io.jsonwebtoken.security.Keys; import javax.crypto.SecretKey; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service; import java.nio.charset.StandardCharsets; import java.util.Date;
@Service public class JwtService {
 private final SecretKey key; private final long expirationMs;
 public JwtService(@Value("${app.jwt.secret}") String secret,@Value("${app.jwt.expiration-ms:86400000}") long expirationMs){ if(secret.getBytes(StandardCharsets.UTF_8).length<32) throw new IllegalArgumentException("APP_JWT_SECRET must be at least 32 bytes"); this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); this.expirationMs=expirationMs; }
 public String generate(String email){ Date now=new Date(); return Jwts.builder().subject(email).issuedAt(now).expiration(new Date(now.getTime()+expirationMs)).signWith(key).compact(); }
 public String extractEmail(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();}
 public boolean isValid(String token){try{return extractEmail(token)!=null;}catch(Exception ex){return false;}}
}
