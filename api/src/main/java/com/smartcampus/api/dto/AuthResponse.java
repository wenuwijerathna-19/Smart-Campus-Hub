package com.smartcampus.api.dto;

import com.smartcampus.api.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private User user;
}
