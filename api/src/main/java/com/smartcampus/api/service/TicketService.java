package com.smartcampus.api.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.smartcampus.api.model.Comment;
import com.smartcampus.api.model.Resource;
import com.smartcampus.api.model.Ticket;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.CommentRepository;
import com.smartcampus.api.repository.NotificationRepository;
import com.smartcampus.api.repository.ResourceRepository;
import com.smartcampus.api.repository.TicketRepository;
import com.smartcampus.api.repository.UserRepository;

@Service
public class TicketService {
    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);
    
    @Autowired private TicketRepository ticketRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ResourceRepository resourceRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private NotificationService notificationService;
    @Autowired private NotificationRepository notificationRepository;

    private List<Ticket> stripAttachments(List<Ticket> tickets) {
        if (tickets != null) {
            tickets.forEach(t -> {
                if (t.getAttachment1() != null && !t.getAttachment1().isEmpty()) t.setAttachment1("true");
                if (t.getAttachment2() != null && !t.getAttachment2().isEmpty()) t.setAttachment2("true");
                if (t.getAttachment3() != null && !t.getAttachment3().isEmpty()) t.setAttachment3("true");
            });
        }
        return tickets;
    }

    public List<Ticket> getAllTickets() {
        return stripAttachments(ticketRepository.findAll());
    }
//backend service validatin for ticket management
    public Ticket getTicketById(@NonNull String id) {
        logger.info("Fetching ticket by ID: {}", id);
        return ticketRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Ticket not found: {}", id);
                    return new RuntimeException("Ticket not found with ID: " + id);
                });
    }

    public List<Ticket> getTicketsByCreator(String creatorId) {
        return stripAttachments(ticketRepository.findByCreator_Id(creatorId));
    }

    public List<Ticket> getTicketsByAssignee(String assigneeId) {
        return stripAttachments(ticketRepository.findByAssignee_Id(assigneeId));
    }

    public Ticket createTicket(@NonNull String creatorId, String resourceId, Ticket request) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = new Ticket();
        ticket.setCreator(creator);

        if (resourceId != null) {
            Resource resource = resourceRepository.findById(resourceId)
                    .orElseThrow(() -> new RuntimeException("Resource not found"));
            ticket.setResource(resource);
        }

        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setContactName(request.getContactName());
        ticket.setContactDetails(request.getContactDetails());
        ticket.setLocation(request.getLocation());
        ticket.setPreferredContactMethod(request.getPreferredContactMethod());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(Ticket.Status.OPEN);
        ticket.setAttachment1(request.getAttachment1());
        ticket.setAttachment2(request.getAttachment2());
        ticket.setAttachment3(request.getAttachment3());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);

        notificationService.notifyTechnicians(
                "New ticket reported: " + saved.getCategory() + " at " + saved.getLocation(),
                "TICKET", saved.getId());

        return saved;
    }

    public Ticket updateTicketStatus(@NonNull String ticketId, Ticket.Status status, String assigneeId, String resolutionNotes, String rejectReason) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        
        if (resolutionNotes != null) ticket.setResolutionNotes(resolutionNotes);
        if (rejectReason != null) ticket.setRejectReason(rejectReason);

        if (assigneeId != null) {
            User assignee = userRepository.findById(assigneeId)
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            ticket.setAssignee(assignee);
            notificationService.createNotification(ticket.getCreator(),
                    "Your ticket #" + ticket.getId() + " has been assigned to a technician.", "TICKET", ticket.getId());
        }
        notificationService.createNotification(ticket.getCreator(),
                "Your ticket #" + ticket.getId() + " status changed to " + status.name() + ".", "TICKET", ticket.getId());
        return ticketRepository.save(ticket);
    }

    public Comment addComment(@NonNull String ticketId, @NonNull String userId, String content) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setTicket(ticket);
        comment.setAuthor(author);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        Comment saved = commentRepository.save(comment);

        notificationService.createNotification(ticket.getCreator(),
                "New update on your ticket #" + ticket.getId() + " from " + author.getName() + ".", "TICKET", ticket.getId());
        return saved;
    }

    public List<Comment> getComments(@NonNull String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public void deleteComment(@NonNull String commentId) {
        commentRepository.deleteById(commentId);
    }

    public Comment updateComment(@NonNull String commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public void deleteTicket(@NonNull String ticketId) {
        // Find and delete all comments for this ticket
        List<Comment> ticketComments = commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
        if (ticketComments != null && !ticketComments.isEmpty()) {
            commentRepository.deleteAll(ticketComments);
        }
        // Delete the ticket
        ticketRepository.deleteById(ticketId);
    }
}
