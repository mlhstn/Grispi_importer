package com.example.demo.Validation;

import java.util.ArrayList;
import java.util.List;

public class OrganizationValidationResult {

    private boolean valid = true;
    private List<String> errors = new ArrayList<>();
    private String organizationIdentifier;

    public void addError(String error) {
        errors.add(error);
        valid = false;
    }

    public boolean isValid() {
        return valid;
    }

    public List<String> getErrors() {
        return errors;
    }

    public String getOrganizationIdentifier() {
        return organizationIdentifier;
    }

    public void setOrganizationIdentifier(String organizationIdentifier) {
        this.organizationIdentifier = organizationIdentifier;
    }
}
