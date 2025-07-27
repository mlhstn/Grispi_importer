package com.example.demo.Controller;

import com.example.demo.DTO.OrganizationImportResponse;
import com.example.demo.Entity.Organization;
import com.example.demo.Mapper.OrganizationMapper;
import com.example.demo.Service.OrganizationService;
import com.example.demo.Validation.OrganizationValidationResult;
import com.example.demo.Validation.OrganizationValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationValidator organizationValidator;
    private final OrganizationService organizationService;
    private final OrganizationMapper organizationMapper;


    public OrganizationController(OrganizationValidator organizationValidator, OrganizationService organizationService, OrganizationMapper organizationMapper) {
        this.organizationValidator = organizationValidator;
        this.organizationService = organizationService;
        this.organizationMapper = organizationMapper;
    }


    @PostMapping("/import")
    public ResponseEntity<OrganizationImportResponse> importOrganizations(@RequestBody List<Map<String, Object>> data) {
        OrganizationImportResponse response = new OrganizationImportResponse();

        for (Map<String, Object> row : data) {
            // Organization nesnesini oluştur
            Organization org = organizationMapper.mapToOrganization(row);

            // Validasyonu çalıştır
            OrganizationValidationResult validationResult = organizationValidator.validate(org);

            // Valid ise kaydet
            if (validationResult.isValid()) {
                organizationService.saveOrganization(org);
                response.getSavedOrganizations().add(org.getExternalId());
            } else {
                validationResult.setOrganizationIdentifier(org.getExternalId());
                response.getFailedOrganizations().add(validationResult);
            }
        }

        return ResponseEntity.ok(response);
    }


}
