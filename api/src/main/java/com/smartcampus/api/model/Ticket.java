package com.smartcampus.api.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;

    @DBRef
    private User creator;

    @DBRef
    private Resource resource;

    @DBRef
    private User assignee;

    private String category;

    private String description;
    private String contactName;
    private String contactDetails;
    private String location;
    private String preferredContactMethod; // "Phone" or "Email"
//validation for priority and status fields
    public enum Priority { LOW, MEDIUM, HIGH, URGENT }
    private Priority priority;

    public enum Status { OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED }
    private Status status;

    private String resolutionNotes;
    private String rejectReason;

    private String attachment1;
    private String attachment2;
    private String attachment3;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
