package com.smartcampus.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class Resource {
    @Id
    private String id;
    private String name;
    public enum Type { ROOM, LAB, EQUIPMENT }
    private Type type;
    private int capacity;
    private String location;
    public enum Status { ACTIVE, OUT_OF_SERVICE }
    private Status status;
    private String imageUrl;
}
