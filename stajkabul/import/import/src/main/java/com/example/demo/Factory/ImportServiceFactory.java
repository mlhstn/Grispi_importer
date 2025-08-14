package com.example.demo.Factory;

import com.example.demo.Service.UserService;
import com.example.demo.Service.TicketService;
import com.example.demo.Service.OrganizationService;
import com.example.demo.Service.GroupService;
import com.example.demo.Service.CustomFieldService;
import com.example.demo.Service.ImportService;
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
                               OrganizationService organizationService,
                               GroupService groupService,
                               CustomFieldService customFieldService) {
        serviceMap = new HashMap<>();
        serviceMap.put("User", userService);
        serviceMap.put("Contact", userService); // Geriye uyumluluk için
        serviceMap.put("Ticket", ticketService);
        serviceMap.put("Organization", organizationService);
        serviceMap.put("Group", groupService);
        serviceMap.put("CustomField", customFieldService);
    }
    
    @SuppressWarnings("unchecked")
    public ImportService getService(String importType) {
        Object service = serviceMap.get(importType);
        if (service == null) {
            throw new IllegalArgumentException("Desteklenmeyen import türü: " + importType);
        }
        return (ImportService) service;
    }
    
    public void registerService(String type, Object service) {
        serviceMap.put(type, service);
    }
    
    public boolean isSupported(String importType) {
        return serviceMap.containsKey(importType);
    }
}
