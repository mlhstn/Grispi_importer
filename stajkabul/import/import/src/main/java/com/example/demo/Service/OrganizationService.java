package com.example.demo.Service;

import com.example.demo.Entity.Organization;
import com.example.demo.Repository.OrganizationRepository;
import com.example.demo.Mapper.OrganizationMapper;
import com.example.demo.Validation.OrganizationValidator;
import com.example.demo.Validation.OrganizationValidationResult;
import com.example.demo.Service.ImportService;
import com.example.demo.Service.ExcelService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@Service
public class OrganizationService implements ImportService {

    private final OrganizationRepository organizationRepository;
    
    @Autowired
    private OrganizationValidator organizationValidator;

    private final ObjectMapper objectMapper;
    private final OrganizationMapper organizationMapper;

    public OrganizationService(OrganizationRepository organizationRepository, OrganizationMapper organizationMapper) {
        this.organizationRepository = organizationRepository;
        this.organizationMapper = organizationMapper;
        this.objectMapper = new ObjectMapper();
    }

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public Optional<Organization> getOrganizationById(Long id) {
        return organizationRepository.findById(id);
    }

    public Organization saveOrganization(Organization organization) {
        return organizationRepository.save(organization);
    }

    public void deleteOrganization(Long id) {
        organizationRepository.deleteById(id);
    }
    
    // Excel verilerini Organization olarak import et
    public ImportResult importOrganizationsFromExcel(List<Map<String, Object>> data, OrganizationMapper organizationMapper) {
        ImportResult result = new ImportResult();
        result.setImportType("Organizations");
        result.setTotalRecords(data.size());
        result.setSuccessCount(0);
        result.setErrorCount(0);
        result.setErrors(new ArrayList<>());

        for (int i = 0; i < data.size(); i++) {
            Map<String, Object> row = data.get(i);
            try {
                // Mapping'i Map<String, String> formatına çevir
                Map<String, String> mappings = new HashMap<>();
                for (Map.Entry<String, Object> entry : row.entrySet()) {
                    mappings.put(entry.getKey(), entry.getKey()); // Excel kolon adını Grispi field olarak kullan
                }
                
                Organization organization = organizationMapper.mapWithMapping(row, mappings);
                OrganizationValidationResult validationResult = organizationValidator.validate(organization);
                
                if (validationResult.isValid()) {
                    organizationRepository.save(organization);
                    result.setSuccessCount(result.getSuccessCount() + 1);
                } else {
                    result.setErrorCount(result.getErrorCount() + 1);
                    result.getErrors().add("Satır " + (i + 1) + ": " + String.join(", ", validationResult.getErrors()));
                }
            } catch (Exception e) {
                result.setErrorCount(result.getErrorCount() + 1);
                result.getErrors().add("Satır " + (i + 1) + ": " + e.getMessage());
            }
        }

        return result;
    }
    
    @Override
    public Map<String, Object> importExcelWithMapping(MultipartFile file, String mappingsJson) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Mapping JSON'ını parse et
            List<Map<String, Object>> mappings = objectMapper.readValue(
                mappingsJson, 
                new TypeReference<List<Map<String, Object>>>() {}
            );
            
            // Mapping'i Map formatına çevir (excelColumn -> grispiField)
            Map<String, String> columnMappings = new HashMap<>();
            for (Map<String, Object> mapping : mappings) {
                String excelColumn = (String) mapping.get("excelColumn");
                String grispiField = (String) mapping.get("grispiField");
                if (excelColumn != null && grispiField != null) {
                    columnMappings.put(excelColumn, grispiField);
                }
            }
            
            System.out.println("OrganizationService - Column mappings: " + columnMappings);
            
            // Excel verilerini oku
            ExcelService excelService = new ExcelService();
            ExcelService.ExcelData excelData = excelService.readFullExcel(file);
            List<Map<String, Object>> transformedData = excelService.transformDataWithMapping(excelData, mappings);
            
            int successCount = 0;
            int errorCount = 0;
            List<String> errors = new ArrayList<>();
            
            for (Map<String, Object> row : transformedData) {
                try {
                    System.out.println("OrganizationService - Processing row: " + row);
                    Organization organization = organizationMapper.mapWithMapping(row, columnMappings);
                    System.out.println("OrganizationService - Mapped organization: " + organization.getExternalId() + ", " + organization.getName());
                    
                    OrganizationValidationResult validationResult = organizationValidator.validate(organization);
                    System.out.println("OrganizationService - Validation result: " + validationResult.isValid() + ", errors: " + validationResult.getErrors());
                    
                    if (validationResult.isValid()) {
                        saveOrganization(organization);
                        successCount++;
                        System.out.println("OrganizationService - Saved successfully: " + organization.getExternalId());
                    } else {
                        errorCount++;
                        errors.add("Row validation failed: " + validationResult.getErrors());
                        System.out.println("OrganizationService - Validation failed: " + validationResult.getErrors());
                    }
                } catch (Exception e) {
                    errorCount++;
                    errors.add("Row processing error: " + e.getMessage());
                    System.out.println("OrganizationService - Exception: " + e.getMessage());
                    e.printStackTrace();
                }
            }
            
            result.put("success", true);
            result.put("totalRecords", transformedData.size());
            result.put("successCount", successCount);
            result.put("errorCount", errorCount);
            result.put("errors", errors);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Import hatası: " + e.getMessage());
        }
        
        return result;
    }
    
    // ImportResult sınıfı
    public static class ImportResult {
        private String importType;
        private int totalRecords;
        private int successCount;
        private int errorCount;
        private List<String> errors;

        public String getImportType() { return importType; }
        public void setImportType(String importType) { this.importType = importType; }

        public int getTotalRecords() { return totalRecords; }
        public void setTotalRecords(int totalRecords) { this.totalRecords = totalRecords; }

        public int getSuccessCount() { return successCount; }
        public void setSuccessCount(int successCount) { this.successCount = successCount; }

        public int getErrorCount() { return errorCount; }
        public void setErrorCount(int errorCount) { this.errorCount = errorCount; }

        public List<String> getErrors() { return errors; }
        public void setErrors(List<String> errors) { this.errors = errors; }
    }
}
