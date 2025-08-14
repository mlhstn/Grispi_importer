package com.example.demo.Validation;

import java.util.ArrayList;
import java.util.List;

public class TicketValidationResult {

    private boolean valid = true;
    private List<String> errors = new ArrayList<>();
    private String ticketIdentifier;

    public void addError(String error) {
        valid = false;
        errors.add(error);
    }

    public boolean isValid() {
        return valid;
    }

    public List<String> getErrors() {
        return errors;
    }

    public String getTicketIdentifier() {
        return ticketIdentifier;
    }

    public void setTicketIdentifier(String ticketIdentifier) {
        this.ticketIdentifier = ticketIdentifier;
    }
}
