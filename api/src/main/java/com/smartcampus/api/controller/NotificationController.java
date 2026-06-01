package com.smartcampus.api.controller;

import com.smartcampus.api.model.Notification;
import com.smartcampus.api.security.UserPrincipal;
import com.smartcampus.api.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// to identify current loged user
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications(@AuthenticationPrincipal UserPrincipal currentUser) {
        return notificationService.getUnreadNotifications(currentUser.getId());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id, @AuthenticationPrincipal UserPrincipal currentUser) {
        notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("")
    public List<Notification> getAllNotifications(@AuthenticationPrincipal UserPrincipal currentUser) {
        return notificationService.getAllNotifications(currentUser.getId());
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal UserPrincipal currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok().build();
    }
}
