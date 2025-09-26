package com.example.demo.ApiClient;

import com.example.demo.Entity.Organization;
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
public class OrganizationApiClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final boolean mockMode;

    public OrganizationApiClient(RestTemplate restTemplate, 
                                @Value("${external.api.base-url}") String baseUrl,
                                @Value("${external.api.mock-mode:false}") boolean mockMode) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.mockMode = mockMode;
    }

    public Optional<Organization> findByExternalId(String externalId) {
        try {
            String url = baseUrl + "/organizations/external/" + externalId;
            ResponseEntity<Organization> response = restTemplate.getForEntity(url, Organization.class);
            return Optional.ofNullable(response.getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Organization saveOrganization(Organization organization) {
        if (mockMode) {
            // Mock response - organization'ı ID ile döndür
            if (organization.getId() == null) {
                organization.setId(System.currentTimeMillis()); // Mock ID
            }
            return organization;
        }
        
        try {
            String url = baseUrl + "/organizations";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<Organization> request = new HttpEntity<>(organization, headers);
            
            ResponseEntity<Organization> response = restTemplate.postForEntity(url, request, Organization.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to save organization: " + e.getMessage(), e);
        }
    }

    public Organization updateOrganization(Organization organization) {
        try {
            String url = baseUrl + "/organizations/" + organization.getId();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<Organization> request = new HttpEntity<>(organization, headers);
            
            ResponseEntity<Organization> response = restTemplate.exchange(url, HttpMethod.PUT, request, Organization.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to update organization: " + e.getMessage(), e);
        }
    }

    public List<Organization> findAll() {
        try {
            String url = baseUrl + "/organizations";
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            @SuppressWarnings("unchecked")
            List<Organization> organizations = response.getBody();
            return organizations;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch organizations: " + e.getMessage(), e);
        }
    }

    public void deleteOrganization(Long id) {
        try {
            String url = baseUrl + "/organizations/" + id;
            restTemplate.delete(url);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete organization: " + e.getMessage(), e);
        }
    }
}
