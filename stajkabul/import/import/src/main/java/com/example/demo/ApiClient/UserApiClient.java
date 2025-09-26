package com.example.demo.ApiClient;

import com.example.demo.Entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

// @Service
public class UserApiClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final boolean mockMode;

    public UserApiClient(RestTemplate restTemplate, 
                        @Value("${external.api.base-url}") String baseUrl,
                        @Value("${external.api.mock-mode:false}") boolean mockMode) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.mockMode = mockMode;
    }

    public Optional<User> findByExternalId(String externalId) {
        try {
            String url = baseUrl + "/users/external/" + externalId;
            ResponseEntity<User> response = restTemplate.getForEntity(url, User.class);
            return Optional.ofNullable(response.getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<User> findByPhone(String phone) {
        try {
            String url = baseUrl + "/users/phone/" + phone;
            ResponseEntity<User> response = restTemplate.getForEntity(url, User.class);
            return Optional.ofNullable(response.getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<User> findByEmail(String email) {
        try {
            String url = baseUrl + "/users/email/" + email;
            ResponseEntity<User> response = restTemplate.getForEntity(url, User.class);
            return Optional.ofNullable(response.getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public User saveUser(User user) {
        if (mockMode) {
            // Mock response - user'ı ID ile döndür
            if (user.getId() == null) {
                user.setId(System.currentTimeMillis()); // Mock ID
            }
            return user;
        }
        
        try {
            String url = baseUrl + "/users";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<User> request = new HttpEntity<>(user, headers);
            
            ResponseEntity<User> response = restTemplate.postForEntity(url, request, User.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to save user: " + e.getMessage(), e);
        }
    }

    public User updateUser(User user) {
        try {
            String url = baseUrl + "/users/" + user.getId();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<User> request = new HttpEntity<>(user, headers);
            
            ResponseEntity<User> response = restTemplate.exchange(url, HttpMethod.PUT, request, User.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user: " + e.getMessage(), e);
        }
    }

    public List<User> findAll() {
        try {
            String url = baseUrl + "/users";
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            @SuppressWarnings("unchecked")
            List<User> users = response.getBody();
            return users;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch users: " + e.getMessage(), e);
        }
    }

    public void deleteUser(Long id) {
        try {
            String url = baseUrl + "/users/" + id;
            restTemplate.delete(url);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete user: " + e.getMessage(), e);
        }
    }
}
