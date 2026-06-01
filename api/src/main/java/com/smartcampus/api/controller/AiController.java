package com.smartcampus.api.controller;

import com.smartcampus.api.dto.AiChatRequest;
import com.smartcampus.api.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody AiChatRequest request) {
        String response = aiService.getChatResponse(request.getMessage());
        return Map.of("response", response);
    }
}
