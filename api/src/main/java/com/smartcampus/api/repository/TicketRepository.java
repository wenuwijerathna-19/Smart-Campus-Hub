package com.smartcampus.api.repository;

import com.smartcampus.api.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    @Query(value = "{}", fields = "{ 'attachment1' : 0, 'attachment2' : 0, 'attachment3' : 0 }")
    List<Ticket> findAll();

    @Query(value = "{ 'creator.id' : ?0 }", fields = "{ 'attachment1' : 0, 'attachment2' : 0, 'attachment3' : 0 }")
    List<Ticket> findByCreator_Id(String creatorId);

    @Query(value = "{ 'assignee.id' : ?0 }", fields = "{ 'attachment1' : 0, 'attachment2' : 0, 'attachment3' : 0 }")
    List<Ticket> findByAssignee_Id(String assigneeId);
}
