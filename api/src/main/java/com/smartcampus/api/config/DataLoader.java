package com.smartcampus.api.config;

import com.smartcampus.api.model.Role;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.ResourceRepository;
import com.smartcampus.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Ensure Admin user exists with fixed ID "1"
        userRepository.findByEmail("admin@smartcampus.edu").ifPresent(user -> {
            if (!"1".equals(user.getId())) userRepository.delete(user);
        });
        if (userRepository.findById("1").isEmpty()) {
            User admin = new User();
            admin.setId("1");
            admin.setEmail("admin@smartcampus.edu");
            admin.setName("Admin Demo");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Admin demo account created with ID 1.");
        }

        // Ensure Normal user exists with fixed ID "2"
        userRepository.findByEmail("user@smartcampus.edu").ifPresent(user -> {
            if (!"2".equals(user.getId())) userRepository.delete(user);
        });
        if (userRepository.findById("2").isEmpty()) {
            User normalUser = new User();
            normalUser.setId("2");
            normalUser.setEmail("user@smartcampus.edu");
            normalUser.setName("Normal User");
            normalUser.setPassword(passwordEncoder.encode("user123"));
            normalUser.setRole(Role.USER);
            userRepository.save(normalUser);
            System.out.println("✅ Normal user account created with ID 2.");
        }
        
        if (userRepository.findByEmail("tech@smartcampus.edu").isEmpty()) {
            User tech = new User();
            tech.setEmail("tech@smartcampus.edu");
            tech.setName("Technician");
            tech.setPassword(passwordEncoder.encode("tech123"));
            tech.setRole(Role.TECHNICIAN);
            userRepository.save(tech);
            System.out.println("✅ Technician account created.");
        }        
    }
}
