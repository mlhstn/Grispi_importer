package com.example.demo.ApiClient;

import com.example.demo.Entity.Group;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

// @Service
public class GroupApiClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public GroupApiClient(RestTemplate restTemplate, @Value("${external.api.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public Optional<Group> findByName(String name) {
        try {
            String url = baseUrl + "/groups/name/" + name;
            ResponseEntity<Group> response = restTemplate.getForEntity(url, Group.class);
            return Optional.ofNullable(response.getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Group saveGroup(Group group) {
        try {
            String url = baseUrl + "/groups";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<Group> request = new HttpEntity<>(group, headers);
            
            ResponseEntity<Group> response = restTemplate.postForEntity(url, request, Group.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to save group: " + e.getMessage(), e);
        }
    }

    public List<Group> findAll() {
        try {
            String url = baseUrl + "/groups";
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            @SuppressWarnings("unchecked")
            List<Group> groups = response.getBody();
            return groups;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch groups: " + e.getMessage(), e);
        }
    }
}
