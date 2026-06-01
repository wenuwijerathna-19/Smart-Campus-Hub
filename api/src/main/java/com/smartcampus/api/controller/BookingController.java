package com.smartcampus.api.controller;

import com.smartcampus.api.model.Booking;
import com.smartcampus.api.security.UserPrincipal;
import com.smartcampus.api.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

//import data from Frontend
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/my") // get my Booking get/Booking getdata
    public List<Booking> getMyBookings(@AuthenticationPrincipal UserPrincipal currentUser) {
        String userId = currentUser != null ? currentUser.getId() : "1";
        return bookingService.getBookingsByUser(userId);
    }

    @PostMapping // input new data
    public Booking requestBooking(@AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, Object> request) {
        String userId = currentUser != null ? currentUser.getId() : "1";
        String resourceId = request.get("resource") != null ? ((Map<?, ?>) request.get("resource")).get("id").toString()
                : null;
        java.time.LocalDateTime startTime = java.time.LocalDateTime.parse(request.get("startTime").toString());
        java.time.LocalDateTime endTime = java.time.LocalDateTime.parse(request.get("endTime").toString());
        String purpose = request.get("purpose").toString();
        Integer attendees = request.get("expectedAttendees") != null
                ? Integer.valueOf(request.get("expectedAttendees").toString())
                : null;
        String contactNumber = request.get("contactNumber") != null ? request.get("contactNumber").toString() : null;
        return bookingService.requestBooking(userId, resourceId, startTime, endTime, purpose, attendees, contactNumber);
    }

    @PutMapping("/{id}/status") // update Booking put/booking logic update/reject
    // @PreAuthorize("hasRole('ADMIN')")
    public Booking updateBookingStatus(@PathVariable("id") String id, @RequestBody Map<String, String> request) {
        Booking.Status status = Booking.Status.valueOf(request.get("status"));
        return bookingService.updateBookingStatus(id, status, request.get("reason"));
    }

    @PutMapping("/{id}/cancel") // cancel Booking put/Booking
    public ResponseEntity<?> cancelBooking(@PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String userId = currentUser != null ? currentUser.getId() : "1";
        bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}") // delete Booking delete/Booking
    public ResponseEntity<?> deleteBooking(@PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String userId = currentUser != null ? currentUser.getId() : "1";
        bookingService.deleteBooking(id, userId);
        return ResponseEntity.ok().build();
    }
}
