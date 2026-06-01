package com.smartcampus.api.repository;

import com.smartcampus.api.model.Booking;
import com.smartcampus.api.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByResourceAndStatusIn(Resource resource, List<Booking.Status> statuses);
    void deleteByResource(Resource resource);
}
