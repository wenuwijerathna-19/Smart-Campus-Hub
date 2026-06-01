package com.smartcampus.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.smartcampus.api.model.Resource;
import com.smartcampus.api.repository.BookingRepository;
import com.smartcampus.api.repository.ResourceRepository;

@Service//logic file
public class ResourceService {
    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    //get all data
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(@NonNull String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }

    public Resource createResource(@NonNull Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(@NonNull String id, Resource resourceDetails) {
        Resource resource = getResourceById(id);
        resource.setName(resourceDetails.getName());
        resource.setType(resourceDetails.getType());
        resource.setCapacity(resourceDetails.getCapacity());
        resource.setLocation(resourceDetails.getLocation());
        resource.setStatus(resourceDetails.getStatus());
        resource.setImageUrl(resourceDetails.getImageUrl());
        return resourceRepository.save(resource);
    }

    public void deleteResource(@NonNull String id) {
        Resource resource = getResourceById(id);
        System.out.println("🔥 Deleting Resource: " + resource.getName() + " and its bookings...");
        bookingRepository.deleteByResource(resource);
        resourceRepository.delete(resource);
    }
}
