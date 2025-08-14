package com.example.demo.Controller;

import com.example.demo.DTO.OrganizationImportRequest;
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
@CrossOrigin(origins = "http://localhost:3000")
public class OrganizationController {

    private final OrganizationValidator organizationValidator;
    private final OrganizationService organizationService;
    private final OrganizationMapper organizationMapper;

    public OrganizationController(OrganizationValidator organizationValidator, OrganizationService organizationService, OrganizationMapper organizationMapper) {
        this.organizationValidator = organizationValidator;
        this.organizationService = organizationService;
        this.organizationMapper = organizationMapper;
    }

    @PostMapping("/validate")
    public ResponseEntity<OrganizationValidationResult> validateOrganization(@RequestBody Organization organization) {
        OrganizationValidationResult result = organizationValidator.validate(organization);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/import")
    public ResponseEntity<OrganizationImportResponse> importOrganizations(@RequestBody List<Organization> organizations) {
        OrganizationImportResponse response = new OrganizationImportResponse();

        for (Organization organization : organizations) {
            OrganizationValidationResult validationResult = organizationValidator.validate(organization);

            if (validationResult.isValid()) {
                organizationService.saveOrganization(organization);
                response.getSavedOrganizations().add(organization.getExternalId());
            } else {
                validationResult.setOrganizationIdentifier(organization.getExternalId());
                response.getFailedOrganizations().add(validationResult);
            }
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/import-mapped")
    public ResponseEntity<OrganizationImportResponse> importMappedOrganizations(@RequestBody OrganizationImportRequest request) {
        OrganizationImportResponse response = new OrganizationImportResponse();

        for (Map<String, Object> row : request.getData()) {
            Organization organization = organizationMapper.mapWithMapping(row, request.getColumnMappings());
            OrganizationValidationResult validationResult = organizationValidator.validate(organization);

            if (validationResult.isValid()) {
                organizationService.saveOrganization(organization);
                response.getSavedOrganizations().add(organization.getExternalId());
            } else {
                validationResult.setOrganizationIdentifier(organization.getExternalId());
                response.getFailedOrganizations().add(validationResult);
            }
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/import-mapping")
    public ResponseEntity<Map<String, Object>> importWithMapping(@RequestBody Map<String, Object> request) {
        try {
            String importType = (String) request.get("importType");
            List<Map<String, Object>> mappings = (List<Map<String, Object>>) request.get("mappings");
            Integer totalRows = (Integer) request.get("totalRows");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Organization mapping verileri alındı",
                "importType", importType,
                "mappedFields", mappings.size(),
                "totalRows", totalRows
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
