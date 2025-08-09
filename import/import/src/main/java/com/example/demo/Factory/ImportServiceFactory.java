package com.example.demo.Factory;

import com.example.demo.Service.UserService;
import com.example.demo.Service.TicketService;
import com.example.demo.Service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ImportServiceFactory {
    
    private final Map<String, Object> serviceMap;
    
    @Autowired
    public ImportServiceFactory(UserService userService, 
                               TicketService ticketService,
                               OrganizationService organizationService) {
        serviceMap = new HashMap<>();
        serviceMap.put("Contact", userService);
        serviceMap.put("Ticket", ticketService);
        serviceMap.put("Organization", organizationService);
    }
    
    @SuppressWarnings("unchecked")
    public <T> T getService(String importType) {
        Object service = serviceMap.get(importType);
        if (service == null) {
            throw new IllegalArgumentException("Desteklenmeyen import türü: " + importType);
        }
        return (T) service;
    }
    
    public void registerService(String type, Object service) {
        serviceMap.put(type, service);
    }
    
    public boolean isSupported(String importType) {
        return serviceMap.containsKey(importType);
    }
}
