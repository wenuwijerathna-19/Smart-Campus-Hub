package com.smartcampus.api.controller;

import com.smartcampus.api.dto.AuthResponse;
import com.smartcampus.api.dto.LoginRequest;
import com.smartcampus.api.dto.SignupRequest;
import com.smartcampus.api.model.Role;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("🔑 Login attempt for: " + loginRequest.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
            System.out.println("✅ Login successful for: " + loginRequest.getEmail());
            return ResponseEntity.ok(new AuthResponse(jwt, user));
        } catch (Exception e) {
            System.out.println("❌ Login failed for: " + loginRequest.getEmail() + " - Reason: " + e.getMessage());
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Invalid email or password."));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        try {
            if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "Email is already registered."));
            }

            User user = new User();
            user.setName(signUpRequest.getName());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
            // Default to USER role if not provided
            user.setRole(signUpRequest.getRole() != null ? signUpRequest.getRole() : Role.STUDENT);

            userRepository.save(user);
            return ResponseEntity.ok(java.util.Map.of("message", "Account created successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Signup failed: " + e.getMessage()));
        }
    }
}
