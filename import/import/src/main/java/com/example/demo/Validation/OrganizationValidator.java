package com.example.demo.Validation;

import com.example.demo.Entity.Organization;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class OrganizationValidator {

    public OrganizationValidationResult validate(Organization organization) {
        OrganizationValidationResult result = new OrganizationValidationResult();

        if (!StringUtils.hasText(organization.getExternalId())) {
            result.addError("externalId boş olamaz.");
        }

        if (!StringUtils.hasText(organization.getName())) {
            result.addError("name boş olamaz.");
        }

        // Tags alanı boş olabilir ama kontrol etmek istersen:
        if (organization.getTags() != null && organization.getTags().contains("")) {
            result.addError("Tags içinde boş değer var.");
        }

        // Domain’ler virgülle ayrıldığı için boş değer olabilir mi kontrolü
        if (organization.getDomains() != null && organization.getDomains().contains("")) {
            result.addError("Domains içinde boş değer var.");
        }

        return result;
    }
}
