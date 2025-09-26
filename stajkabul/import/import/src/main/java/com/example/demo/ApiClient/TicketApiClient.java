package com.example.demo.ApiClient;

import com.example.demo.Entity.Ticket;
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
public class TicketApiClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final boolean mockMode;

    public TicketApiClient(RestTemplate restTemplate, 
                          @Value("${external.api.base-url}") String baseUrl,
                          @Value("${external.api.mock-mode:false}") boolean mockMode) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.mockMode = mockMode;
    }

    public Optional<Ticket> findByExternalId(String externalId) {
        try {
            String url = baseUrl + "/tickets/external/" + externalId;
            ResponseEntity<Ticket> response = restTemplate.getForEntity(url, Ticket.class);
            return Optional.ofNullable(response.getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Ticket saveTicket(Ticket ticket) {
        if (mockMode) {
            // Mock response - ticket'ı ID ile döndür
            if (ticket.getId() == null) {
                ticket.setId(System.currentTimeMillis()); // Mock ID
            }
            return ticket;
        }
        
        try {
            String url = baseUrl + "/tickets";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<Ticket> request = new HttpEntity<>(ticket, headers);
            
            ResponseEntity<Ticket> response = restTemplate.postForEntity(url, request, Ticket.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to save ticket: " + e.getMessage(), e);
        }
    }

    public Ticket updateTicket(Ticket ticket) {
        try {
            String url = baseUrl + "/tickets/" + ticket.getId();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<Ticket> request = new HttpEntity<>(ticket, headers);
            
            ResponseEntity<Ticket> response = restTemplate.exchange(url, HttpMethod.PUT, request, Ticket.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to update ticket: " + e.getMessage(), e);
        }
    }

    public List<Ticket> findAll() {
        try {
            String url = baseUrl + "/tickets";
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            @SuppressWarnings("unchecked")
            List<Ticket> tickets = response.getBody();
            return tickets;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch tickets: " + e.getMessage(), e);
        }
    }

    public void deleteTicket(Long id) {
        try {
            String url = baseUrl + "/tickets/" + id;
            restTemplate.delete(url);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete ticket: " + e.getMessage(), e);
        }
    }
}
