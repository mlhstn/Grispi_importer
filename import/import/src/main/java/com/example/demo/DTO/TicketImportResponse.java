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

    public List<TicketValidationResult> getFailedTickets() {
        return failedTickets;
    }
}
