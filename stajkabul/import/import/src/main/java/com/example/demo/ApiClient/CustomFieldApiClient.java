package com.example.demo.ApiClient;

import com.example.demo.Entity.CustomField;
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
public class CustomFieldApiClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public CustomFieldApiClient(RestTemplate restTemplate, @Value("${external.api.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public Optional<CustomField> findByKey(String key) {
        try {
            String url = baseUrl + "/custom-fields/key/" + key;
            ResponseEntity<CustomField> response = restTemplate.getForEntity(url, CustomField.class);
            return Optional.ofNullable(response.getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public CustomField saveCustomField(CustomField customField) {
        try {
            String url = baseUrl + "/custom-fields";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<CustomField> request = new HttpEntity<>(customField, headers);
            
            ResponseEntity<CustomField> response = restTemplate.postForEntity(url, request, CustomField.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to save custom field: " + e.getMessage(), e);
        }
    }

    public CustomField updateCustomField(CustomField customField) {
        try {
            String url = baseUrl + "/custom-fields/" + customField.getId();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<CustomField> request = new HttpEntity<>(customField, headers);
            
            ResponseEntity<CustomField> response = restTemplate.exchange(url, HttpMethod.PUT, request, CustomField.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to update custom field: " + e.getMessage(), e);
        }
    }

    public List<CustomField> findAll() {
        try {
            String url = baseUrl + "/custom-fields";
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            @SuppressWarnings("unchecked")
            List<CustomField> customFields = response.getBody();
            return customFields;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch custom fields: " + e.getMessage(), e);
        }
    }

    public void deleteCustomField(Long id) {
        try {
            String url = baseUrl + "/custom-fields/" + id;
            restTemplate.delete(url);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete custom field: " + e.getMessage(), e);
        }
    }
}
