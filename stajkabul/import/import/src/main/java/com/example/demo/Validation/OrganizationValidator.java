package com.example.demo.Validation;

import com.example.demo.Entity.Organization;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class OrganizationValidator {

    public OrganizationValidationResult validate(Organization organization) {
        OrganizationValidationResult result = new OrganizationValidationResult();

        if (!StringUtils.hasText(organization.getExternalId())) {
            result.addError("externalId cannot be empty.");
        }

        return result;
    }
}
