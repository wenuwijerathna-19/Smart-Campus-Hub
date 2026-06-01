package com.smartcampus.api.service;

import com.smartcampus.api.model.Booking;
import com.smartcampus.api.model.Resource;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.BookingRepository;
import com.smartcampus.api.repository.ResourceRepository;
import com.smartcampus.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service // logic file
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ResourceRepository resourceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;

    // getall data
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // filter
    public List<Booking> getBookingsByUser(@NonNull String userId) {
        return bookingRepository.findByUserId(userId);
    }

    // req new bookin 31-61
    public Booking requestBooking(@NonNull String userId, @NonNull String resourceId, LocalDateTime startTime,
            LocalDateTime endTime, String purpose, Integer attendees, String contactNumber) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Conflict check: find any bookings for same resource with PENDING or APPROVED
        // status Mobile Number cheack
        List<Booking> existingBookings = bookingRepository.findByResourceAndStatusIn(
                resource, Arrays.asList(Booking.Status.PENDING, Booking.Status.APPROVED));
        boolean conflict = existingBookings.stream()
                .anyMatch(b -> startTime.isBefore(b.getEndTime()) && endTime.isAfter(b.getStartTime()));
        if (conflict) {
            throw new RuntimeException("Booking conflict: Resource is not available in this time slot.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setPurpose(purpose);
        booking.setExpectedAttendees(attendees);
        booking.setContactNumber(contactNumber);
        booking.setStatus(Booking.Status.PENDING);
        Booking saved = bookingRepository.save(booking);
        // notification part belong to wenu
        notificationService.createNotification(user,
                "Your booking for " + resource.getName() + " has been submitted and is pending approval.",
                "BOOKING", saved.getId());

        notificationService.notifyAdmins(
                "New booking request for " + resource.getName() + " by " + user.getName() + ".",
                "BOOKING", saved.getId());

        return saved;
    }

    // update logic update/reject
    public Booking updateBookingStatus(@NonNull String bookingId, Booking.Status status, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        if (reason != null)
            booking.setRejectionReason(reason);
        Booking saved = bookingRepository.save(booking);

        notificationService.createNotification(booking.getUser(),
                "Your booking for " + booking.getResource().getName() + " has been " + status.name() + ".",
                "BOOKING", saved.getId());
        return saved;
    }

    // logic cancel booking
    public void cancelBooking(@NonNull String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Cannot cancel another user's booking");
        }
        booking.setStatus(Booking.Status.CANCELLED);
        bookingRepository.save(booking);
    }

    // Logic delete booking
    public void deleteBooking(@NonNull String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        // Admins can delete any booking; no ownership check here
        if (booking != null) {
            bookingRepository.delete(booking);
        }
    }
}
