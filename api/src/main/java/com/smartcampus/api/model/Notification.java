package com.smartcampus.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    @DBRef
    private User user;

    private String message;
    @com.fasterxml.jackson.annotation.JsonProperty("isRead")
    private boolean isRead;
    private String relatedEntityType; // "BOOKING" or "TICKET"
    private String relatedEntityId;
    private LocalDateTime createdAt;
}
