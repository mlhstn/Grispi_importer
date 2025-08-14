package com.example.demo.Validation;

import java.util.ArrayList;
import java.util.List;

public class CustomFieldValidationResult {
    private boolean valid = true;
    private List<String> errors = new ArrayList<>();
    private String customFieldKey;

    public boolean isValid() {
        return valid;
    }

    public void addError(String error) {
        valid = false;
        errors.add(error);
    }

    public List<String> getErrors() {
        return errors;
    }

    public String getCustomFieldKey() {
        return customFieldKey;
    }

    public void setCustomFieldKey(String customFieldKey) {
        this.customFieldKey = customFieldKey;
    }
}
