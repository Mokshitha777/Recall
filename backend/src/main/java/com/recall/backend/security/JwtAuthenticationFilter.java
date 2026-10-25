package com.recall.backend.security;
import com.recall.backend.repository.AppUserRepository; import jakarta.servlet.FilterChain; import jakarta.servlet.ServletException; import jakarta.servlet.http.*; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.core.authority.SimpleGrantedAuthority; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter; import java.io.IOException; import java.util.List;
@Component public class JwtAuthenticationFilter extends OncePerRequestFilter {
 private final JwtService jwtService; private final AppUserRepository users;
 public JwtAuthenticationFilter(JwtService jwtService,AppUserRepository users){this.jwtService=jwtService;this.users=users;}
 @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain)throws ServletException,IOException {
  String header=request.getHeader("Authorization"); if(header!=null&&header.startsWith("Bearer ")){String token=header.substring(7); try{String email=jwtService.extractEmail(token); var user=users.findByEmailIgnoreCase(email); if(user.isPresent()&&SecurityContextHolder.getContext().getAuthentication()==null){var auth=new UsernamePasswordAuthenticationToken(email,null,List.of(new SimpleGrantedAuthority("ROLE_USER"))); SecurityContextHolder.getContext().setAuthentication(auth);}}catch(Exception ignored){}}
  chain.doFilter(request,response);
 }
}
