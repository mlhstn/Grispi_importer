package com.example.demo.Service;

import com.example.demo.Entity.CustomField;
import com.example.demo.Repository.CustomFieldRepository;
import com.example.demo.Mapper.CustomFieldMapper;
import com.example.demo.Validation.CustomFieldValidator;
import com.example.demo.Validation.CustomFieldValidationResult;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class CustomFieldService implements ImportService {

    private final CustomFieldRepository customFieldRepository;
    private final CustomFieldMapper customFieldMapper;
    private final CustomFieldValidator customFieldValidator;
    private final ObjectMapper objectMapper;

    public CustomFieldService(CustomFieldRepository customFieldRepository, 
                             CustomFieldMapper customFieldMapper, 
                             CustomFieldValidator customFieldValidator,
                             ObjectMapper objectMapper) {
        this.customFieldRepository = customFieldRepository;
        this.customFieldMapper = customFieldMapper;
        this.customFieldValidator = customFieldValidator;
        this.objectMapper = objectMapper;
    }

    public List<CustomField> getAllCustomFields() {
        return customFieldRepository.findAll();
    }

    public Optional<CustomField> getCustomFieldById(Long id) {
        return customFieldRepository.findById(id);
    }

    public CustomField saveCustomField(CustomField customField) {
        return customFieldRepository.save(customField);
    }

    public void deleteCustomField(Long id) {
        customFieldRepository.deleteById(id);
    }

    public CustomField save(CustomField field) {
        return customFieldRepository.save(field);
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
            
            // Mapping'i Map formatına çevir
            Map<String, String> columnMappings = new HashMap<>();
            for (Map<String, Object> mapping : mappings) {
                String excelColumn = (String) mapping.get("excelColumn");
                String grispiField = (String) mapping.get("grispiField");
                if (excelColumn != null && grispiField != null) {
                    // Frontend formatı: excelColumn -> grispiField
                    columnMappings.put(excelColumn, grispiField);
                }
            }
            
            System.out.println("CustomFieldService - Column mappings: " + columnMappings);
            
            // Excel verilerini gerçekten oku
            List<Map<String, Object>> excelData = readExcelData(file);
            System.out.println("CustomFieldService - Excel data size: " + excelData.size());
            
            int successCount = 0;
            int errorCount = 0;
            List<String> errors = new ArrayList<>();
            
            for (Map<String, Object> row : excelData) {
                try {
                    System.out.println("CustomFieldService - Processing row: " + row);
                    CustomField customField = customFieldMapper.mapWithMapping(row, columnMappings);
                    System.out.println("CustomFieldService - Mapped field: " + customField.getKey() + ", " + customField.getName());
                    
                    CustomFieldValidationResult validationResult = customFieldValidator.validate(customField);
                    System.out.println("CustomFieldService - Validation result: " + validationResult.isValid() + ", errors: " + validationResult.getErrors());
                    
                    if (validationResult.isValid()) {
                        saveCustomField(customField);
                        successCount++;
                        System.out.println("CustomFieldService - Saved successfully: " + customField.getKey());
                    } else {
                        errorCount++;
                        errors.add("Row validation failed: " + validationResult.getErrors());
                        System.out.println("CustomFieldService - Validation failed: " + validationResult.getErrors());
                    }
                } catch (Exception e) {
                    errorCount++;
                    errors.add("Row processing error: " + e.getMessage());
                    System.out.println("CustomFieldService - Exception: " + e.getMessage());
                    e.printStackTrace();
                }
            }
            
            result.put("success", true);
            result.put("totalRecords", excelData.size());
            result.put("successCount", successCount);
            result.put("errorCount", errorCount);
            result.put("errors", errors);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Import error: " + e.getMessage());
        }
        
        return result;
    }

    private List<Map<String, Object>> readExcelData(MultipartFile file) throws Exception {
        List<Map<String, Object>> data = new ArrayList<>();
        
        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            
            if (headerRow == null) {
                return data;
            }
            
            // Header'ları al
            List<String> headers = new ArrayList<>();
            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                Cell cell = headerRow.getCell(i);
                headers.add(cell != null ? cell.toString() : "Column" + i);
            }
            
            // Veri satırlarını oku
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                Map<String, Object> rowData = new HashMap<>();
                for (int j = 0; j < headers.size(); j++) {
                    Cell cell = row.getCell(j);
                    String value = "";
                    if (cell != null) {
                        switch (cell.getCellType()) {
                            case STRING:
                                value = cell.getStringCellValue();
                                break;
                            case NUMERIC:
                                value = String.valueOf((int) cell.getNumericCellValue());
                                break;
                            case BOOLEAN:
                                value = String.valueOf(cell.getBooleanCellValue());
                                break;
                            default:
                                value = "";
                        }
                    }
                    rowData.put(headers.get(j), value);
                }
                data.add(rowData);
            }
        }
        
        return data;
    }
}
