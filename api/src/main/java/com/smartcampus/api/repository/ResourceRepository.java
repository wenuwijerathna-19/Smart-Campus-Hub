package com.smartcampus.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartcampus.api.model.Resource;

//conect to the mongodb 
public interface ResourceRepository extends MongoRepository<Resource, String> {
}
