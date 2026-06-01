package com.smartcampus.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String name;
    private String password;
    private Role role;
    private String oauthProviderId;
    
    // Extended Profile Fields
    private String phoneNumber;     // User's primary contact number
    private String department;      // Academic or administrative department
    private String faculty;         // University faculty (e.g., Engineering, IT)
    private String bio;             // Short professional or personal biography
    private String profileImage;    // URL or path to the user's profile picture
    private String status = "ACTIVE"; // Account status (ACTIVE or DEACTIVATED)
    private LocalDateTime joinedDate = LocalDateTime.now(); // Timestamp of account creation
}
