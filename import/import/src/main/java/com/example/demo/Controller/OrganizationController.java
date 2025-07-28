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
public class OrganizationController {

    private final OrganizationValidator organizationValidator;
    private final OrganizationService organizationService;
    private final OrganizationMapper organizationMapper;

    public OrganizationController(OrganizationValidator organizationValidator,
                                  OrganizationService organizationService,
                                  OrganizationMapper organizationMapper) {
        this.organizationValidator = organizationValidator;
        this.organizationService = organizationService;
        this.organizationMapper = organizationMapper;
    }

    // 🧠 Dinamik eşleştirme ile organization import endpoint'i
    @PostMapping("/import-mapped")
    public ResponseEntity<OrganizationImportResponse> importMappedOrganizations(
            @RequestBody OrganizationImportRequest request) {

        OrganizationImportResponse response = new OrganizationImportResponse();

        List<Map<String, Object>> data = request.getData();
        Map<String, String> columnMappings = request.getColumnMappings();

        for (Map<String, Object> row : data) {
            // Map -> Organization dönüşümü (eşleştirmeyle)
            Organization org = organizationMapper.mapToOrganization(row, columnMappings);

            // Validasyon
            OrganizationValidationResult validationResult = organizationValidator.validate(org);

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
