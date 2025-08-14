package com.example.demo.Validation;

import java.util.ArrayList;
import java.util.List;

public class GroupValidationResult {
    private boolean valid = true;
    private List<String> errors = new ArrayList<>();
    private String groupIdentifier;

    public boolean isValid() {
        return valid && errors.isEmpty();
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public void addError(String error) {
        this.errors.add(error);
        this.valid = false;
    }

    public String getGroupIdentifier() {
        return groupIdentifier;
    }

    public void setGroupIdentifier(String groupIdentifier) {
        this.groupIdentifier = groupIdentifier;
    }
}
