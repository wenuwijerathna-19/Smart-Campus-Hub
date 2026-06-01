package com.smartcampus.api.service;

import com.smartcampus.api.model.Notification;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private com.smartcampus.api.repository.UserRepository userRepository;

    public void createNotification(User user, String message, String entityType, String entityId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setRelatedEntityType(entityType);
        notification.setRelatedEntityId(entityId);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    // notifyTechnicians, the system uses the UserRepository to find users who have
    // a specific role and then sends notifications to them.
    public void notifyAdmins(String message, String entityType, String entityId) {
        List<com.smartcampus.api.model.Role> adminRoles = java.util.Arrays.asList(
                com.smartcampus.api.model.Role.ADMIN,
                com.smartcampus.api.model.Role.STAFF);
        List<User> admins = userRepository.findAll().stream()
                .filter(u -> adminRoles.contains(u.getRole()))
                .toList();

        for (User admin : admins) {
            createNotification(admin, message, entityType, entityId);
        }
    }

    public void notifyTechnicians(String message, String entityType, String entityId) {
        List<User> technicians = userRepository.findByRole(com.smartcampus.api.model.Role.TECHNICIAN);
        for (User tech : technicians) {
            createNotification(tech, message, entityType, entityId);
        }
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(@NonNull String notificationId, String userId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            if (notification.getUser().getId().equals(userId)) {
                notification.setRead(true);
                notificationRepository.save(notification);
            }
        });
    }

    public List<Notification> getAllNotifications(String userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }
}
