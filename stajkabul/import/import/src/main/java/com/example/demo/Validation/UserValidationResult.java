package com.example.demo.Validation;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class UserValidationResult {
    private boolean valid;
    private List<String> errors;
    private String userIdentifier;
    private Integer rowNumber; // Excel satır numarası
    private Map<String, Object> originalData; // Orijinal Excel verisi

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

    public Integer getRowNumber() {
        return rowNumber;
    }

    public void setRowNumber(Integer rowNumber) {
        this.rowNumber = rowNumber;
    }

    public Map<String, Object> getOriginalData() {
        return originalData;
    }

    public void setOriginalData(Map<String, Object> originalData) {
        this.originalData = originalData;
    }
}
