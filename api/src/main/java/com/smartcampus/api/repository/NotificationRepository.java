package com.smartcampus.api.repository;

import com.smartcampus.api.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(String userId);
    List<Notification> findByUser_IdOrderByCreatedAtDesc(String userId);
}
