package com.example.demo.Service;

import com.example.demo.Entity.Organization;
import com.example.demo.Repository.OrganizationRepository;
import com.example.demo.Mapper.OrganizationMapper;
import com.example.demo.Validation.OrganizationValidator;
import com.example.demo.Validation.OrganizationValidationResult;
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
        // Duplicate externalId kontrolü
        if (organization.getExternalId() != null) {
            Optional<Organization> existingOrganization = organizationRepository.findAll().stream()
                .filter(o -> organization.getExternalId().equals(o.getExternalId()))
                .findFirst();
            
            if (existingOrganization.isPresent()) {
                throw new IllegalArgumentException("Organization with externalId " + organization.getExternalId() + " already exists");
            }
        }
        
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
                    // DB'ye kayıt yapma - sadece validasyon
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
            
            // Excel verilerini oku
            ExcelService excelService = new ExcelService();
            ExcelService.ExcelData excelData = excelService.readFullExcel(file);
            List<Map<String, Object>> transformedData = excelService.transformDataWithMapping(excelData, mappings);
            
            int successCount = 0;
            int errorCount = 0;
            List<String> errors = new ArrayList<>();
            
            List<Map<String, Object>> errorDetails = new ArrayList<>();
            
            // Dosya içi duplicate kontrolü için Set
            java.util.Set<String> seenExternalIds = new java.util.HashSet<>();
            
            for (int i = 0; i < transformedData.size(); i++) {
                Map<String, Object> row = transformedData.get(i);
                try {
                    Organization organization = organizationMapper.mapWithMapping(row, columnMappings);
                    
                    // Dosya içi External ID duplicate kontrolü
                    if (organization.getExternalId() != null && !organization.getExternalId().trim().isEmpty()) {
                        if (seenExternalIds.contains(organization.getExternalId())) {
                            errorCount++;
                            errors.add("Row " + (i + 1) + ": Duplicate externalId in file: " + organization.getExternalId());
                            
                            Map<String, Object> errorDetail = new HashMap<>();
                            errorDetail.put("rowNumber", i + 1);
                            errorDetail.put("originalData", row);
                            errorDetail.put("errors", List.of("Duplicate externalId in file: " + organization.getExternalId()));
                            errorDetails.add(errorDetail);
                            continue;
                        }
                        seenExternalIds.add(organization.getExternalId());
                    }
                    
                    OrganizationValidationResult validationResult = organizationValidator.validate(organization);
                    
                    if (validationResult.isValid()) {
                        // DB'ye kayıt yapma - sadece validasyon
                        successCount++;
                    } else {
                        errorCount++;
                        errors.add("Row " + (i + 1) + " validation failed: " + String.join(", ", validationResult.getErrors()));
                        
                        // Detaylı hata bilgisi ekle
                        Map<String, Object> errorDetail = new HashMap<>();
                        errorDetail.put("rowNumber", i + 1);
                        errorDetail.put("originalData", row);
                        errorDetail.put("errors", validationResult.getErrors());
                        errorDetails.add(errorDetail);
                    }
                } catch (Exception e) {
                    errorCount++;
                    errors.add("Row " + (i + 1) + " processing error: " + e.getMessage());
                    
                    // Detaylı hata bilgisi ekle
                    Map<String, Object> errorDetail = new HashMap<>();
                    errorDetail.put("rowNumber", i + 1);
                    errorDetail.put("originalData", row);
                                             errorDetail.put("errors", List.of("Processing error: " + e.getMessage()));
                    errorDetails.add(errorDetail);
                }
            }
            
                         result.put("success", true);
             result.put("totalRecords", transformedData.size());
             result.put("successCount", successCount);
             result.put("errorCount", errorCount);
             result.put("errors", errorDetails);
            
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
