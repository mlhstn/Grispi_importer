package com.example.demo.DTO;

import com.example.demo.Validation.TicketValidationResult;
import java.util.ArrayList;
import java.util.List;

public class TicketImportResponse {
    private List<String> savedTickets = new ArrayList<>();
    private List<TicketValidationResult> failedTickets = new ArrayList<>();

    public List<String> getSavedTickets() {
        return savedTickets;
    }

    public void setSavedTickets(List<String> savedTickets) {
        this.savedTickets = savedTickets;
    }

    public List<TicketValidationResult> getFailedTickets() {
        return failedTickets;
    }

    public void setFailedTickets(List<TicketValidationResult> failedTickets) {
        this.failedTickets = failedTickets;
    }
}
