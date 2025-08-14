package com.example.demo.DTO;

import com.example.demo.Validation.OrganizationValidationResult;
import java.util.ArrayList;
import java.util.List;

public class OrganizationImportResponse {

    private List<String> savedOrganizations = new ArrayList<>();
    private List<OrganizationValidationResult> failedOrganizations = new ArrayList<>();

    public List<String> getSavedOrganizations() {
        return savedOrganizations;
    }

    public List<OrganizationValidationResult> getFailedOrganizations() {
        return failedOrganizations;
    }
}
