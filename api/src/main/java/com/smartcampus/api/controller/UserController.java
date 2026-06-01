package com.smartcampus.api.controller;

import com.smartcampus.api.model.Role;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import com.smartcampus.api.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Retrieve the currently authenticated user's profile details.
     */
    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Fetch a list of all technicians for assignment in the support system.
     */
    @GetMapping("/technicians")
    public List<User> getTechnicians() {
        return userRepository.findByRole(Role.TECHNICIAN);
    }

    /**
     * Update the profile information for the logged-in user.
     * Includes server-side validation for mandatory fields and formats.
     */
    @PutMapping("/me/profile")
    public User updateProfile(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody User profileData) {
        
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        
        // Basic validation: Name must not be empty
        if (profileData.getName() == null || profileData.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        
        // Validation: Phone number must be exactly 10 digits
        if (profileData.getPhoneNumber() != null && !profileData.getPhoneNumber().isEmpty()) {
            String digitsOnly = profileData.getPhoneNumber().replaceAll("\\D", "");
            if (digitsOnly.length() != 10) {
                throw new RuntimeException("Phone number must be exactly 10 digits");
            }
        }
        
        // Update user fields with new data
        user.setName(profileData.getName());
        user.setPhoneNumber(profileData.getPhoneNumber());
        user.setDepartment(profileData.getDepartment());
        user.setFaculty(profileData.getFaculty());
        user.setBio(profileData.getBio());
        user.setProfileImage(profileData.getProfileImage());
        
        return userRepository.save(user);
    }

    /**
     * Deactivate the user's account (Soft Delete).
     * This preserves record integrity while preventing future logins.
     */
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        
        // Set account status to DEACTIVATED instead of deleting from DB
        user.setStatus("DEACTIVATED");
        userRepository.save(user);
        
        return ResponseEntity.ok().body(Map.of("message", "Account deactivated successfully"));
    }
}
