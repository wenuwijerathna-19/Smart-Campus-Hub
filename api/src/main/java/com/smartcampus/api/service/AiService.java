package com.smartcampus.api.service;

import com.smartcampus.api.model.Booking;
import com.smartcampus.api.model.Resource;
import com.smartcampus.api.repository.BookingRepository;
import com.smartcampus.api.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    public String getChatResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();
        String url = GEMINI_URL + apiKey;

        // Build context
        String context = buildContext();
        String fullPrompt = "Context about the Smart Campus Hub:\n" + context + 
                           "\n\nUser Question: " + userMessage + 
                           "\n\nInstructions: You are a Smart Campus AI Assistant. Use the context above to answer the user's question concisely. If the user reports an issue, suggest they create a support ticket. If they ask about availability, check the resources and bookings provided in the context.";

        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> contents = List.of(
            Map.of("parts", List.of(Map.of("text", fullPrompt)))
        );
        requestBody.put("contents", contents);

        try {
            Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
            return "I'm sorry, I couldn't process that request right now.";
        } catch (Exception e) {
            return "Error communicating with AI: " + e.getMessage();
        }
    }

    private String buildContext() {
        List<Resource> resources = resourceRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        StringBuilder sb = new StringBuilder();
        sb.append("Current Resources:\n");
        for (Resource r : resources) {
            sb.append("- ").append(r.getName()).append(" (Type: ").append(r.getType())
              .append(", Capacity: ").append(r.getCapacity()).append(", Status: ").append(r.getStatus()).append(")\n");
        }

        sb.append("\nRecent/Upcoming Bookings:\n");
        // Only include some recent/upcoming bookings to save tokens
        LocalDateTime now = LocalDateTime.now();
        List<Booking> relevantBookings = bookings.stream()
                .filter(b -> b.getEndTime().isAfter(now.minusDays(1)))
                .limit(20)
                .collect(Collectors.toList());

        for (Booking b : relevantBookings) {
            sb.append("- Resource: ").append(b.getResource().getName())
              .append(", From: ").append(b.getStartTime())
              .append(", To: ").append(b.getEndTime())
              .append(", Status: ").append(b.getStatus()).append("\n");
        }

        return sb.toString();
    }
}
