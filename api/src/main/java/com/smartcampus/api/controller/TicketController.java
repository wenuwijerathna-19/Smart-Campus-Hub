package com.smartcampus.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.api.model.Comment;
import com.smartcampus.api.model.Ticket;
import com.smartcampus.api.security.UserPrincipal;
import com.smartcampus.api.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;
   //http methods for ticket management
    @GetMapping
    // @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/my")
    public List<Ticket> getMyTickets(@AuthenticationPrincipal UserPrincipal currentUser) {
        String userId = currentUser != null ? currentUser.getId() : "1";
        return ticketService.getTicketsByCreator(userId);
    }

    @GetMapping("/technician/my-tickets")
    public List<Ticket> getTechnicianTickets(@AuthenticationPrincipal UserPrincipal currentUser) {
        String userId = currentUser != null ? currentUser.getId() : "1";
        return ticketService.getTicketsByAssignee(userId);
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable("id") String id) {
        return ticketService.getTicketById(id);
    }

    @PostMapping
    public Ticket createTicket(@AuthenticationPrincipal UserPrincipal currentUser, @RequestBody Ticket request) {
        String userId = currentUser != null ? currentUser.getId() : "1";
        String resourceId = request.getResource() != null ? request.getResource().getId() : null;
        return ticketService.createTicket(userId, resourceId, request);
    }

    @PutMapping("/{id}/status")
    // @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public Ticket updateTicketStatus(@PathVariable("id") String id, @RequestBody Map<String, Object> request) {
        Ticket.Status status = Ticket.Status.valueOf(request.get("status").toString());
        String assigneeId = request.get("assigneeId") != null ? request.get("assigneeId").toString() : null;
        String resolutionNotes = request.get("resolutionNotes") != null ? request.get("resolutionNotes").toString() : null;
        String rejectReason = request.get("rejectReason") != null ? request.get("rejectReason").toString() : null;
        return ticketService.updateTicketStatus(id, status, assigneeId, resolutionNotes, rejectReason);
    }

    @GetMapping("/{id}/comments")
    public List<Comment> getTicketComments(@PathVariable("id") String id) {
        return ticketService.getComments(id);
    }

    @PostMapping("/{id}/comments")
    public Comment addComment(@PathVariable("id") String id, @AuthenticationPrincipal UserPrincipal currentUser, @RequestBody Map<String, String> request) {
        String userId = currentUser != null ? currentUser.getId() : "1";
        return ticketService.addComment(id, userId, request.get("content"));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable("id") String id) {
        ticketService.deleteComment(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/comments/{id}")
    public Comment updateComment(@PathVariable("id") String id, @RequestBody Map<String, String> request) {
        return ticketService.updateComment(id, request.get("content"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable("id") String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok().build();
    }
}
