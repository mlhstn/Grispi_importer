package com.example.demo.Validation;

import java.util.ArrayList;
import java.util.List;

public class UserValidationResult {
    private boolean valid;
    private List<String> errors;


    private String userIdentifier;

    public UserValidationResult() {
        this.valid = true;
        this.errors = new ArrayList<>();
    }

    public void addError(String error) {
        this.valid = false;
        this.errors.add(error);
    }

    public boolean isValid() {
        return valid;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setUserIdentifier(String id) {
        this.userIdentifier = id;
    }

    public String getUserIdentifier() {
        return userIdentifier;
    }
}
