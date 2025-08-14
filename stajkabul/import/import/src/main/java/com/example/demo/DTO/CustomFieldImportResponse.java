package com.example.demo.DTO;

import com.example.demo.Validation.CustomFieldValidationResult;
import java.util.ArrayList;
import java.util.List;

public class CustomFieldImportResponse {
    private List<String> savedCustomFields = new ArrayList<>();
    private List<CustomFieldValidationResult> failedCustomFields = new ArrayList<>();

    public List<String> getSavedCustomFields() {
        return savedCustomFields;
    }

    public List<CustomFieldValidationResult> getFailedCustomFields() {
        return failedCustomFields;
    }
}
