package com.smartcampus.api.repository;

import com.smartcampus.api.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    @org.springframework.data.mongodb.repository.Query("{ 'ticket.$id' : ?0 }")
    List<Comment> findByTicketIdOrderByCreatedAtAsc(String ticketId);
}
