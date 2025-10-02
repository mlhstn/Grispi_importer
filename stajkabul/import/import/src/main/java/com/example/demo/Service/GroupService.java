package com.example.demo.Service;

import com.example.demo.Entity.Group;
import com.example.demo.Repository.GroupRepository;
import com.example.demo.Mapper.GroupMapper;
import com.example.demo.Validation.GroupValidator;
import com.example.demo.Validation.GroupValidationResult;
import com.example.demo.Service.ExcelService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class GroupService implements ImportService {

    private final GroupRepository groupRepository;
    private final GroupMapper groupMapper;
    private final GroupValidator groupValidator;
    private final ObjectMapper objectMapper;

    public GroupService(GroupRepository groupRepository, 
                       GroupMapper groupMapper, 
                       GroupValidator groupValidator,
                       ObjectMapper objectMapper) {
        this.groupRepository = groupRepository;
        this.groupMapper = groupMapper;
        this.groupValidator = groupValidator;
        this.objectMapper = objectMapper;
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }

    public Group saveGroup(Group group) {
        return groupRepository.save(group);
    }

    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
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
            
            for (Map<String, Object> row : transformedData) {
                try {
                    Group group = groupMapper.mapWithMapping(row, new HashMap<>());
                    GroupValidationResult validationResult = groupValidator.validate(group);
                    
                    if (validationResult.isValid()) {
                        // DB'ye kayıt yapma - sadece validasyon
                        successCount++;
                    } else {
                        errorCount++;
                        errors.add("Row validation failed: " + validationResult.getErrors());
                    }
                } catch (Exception e) {
                    errorCount++;
                    errors.add("Row processing error: " + e.getMessage());
                }
            }
            
            result.put("success", true);
            result.put("totalRecords", transformedData.size());
            result.put("successCount", successCount);
            result.put("errorCount", errorCount);
            result.put("errors", errors);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Import error: " + e.getMessage());
        }
        
        return result;
    }
}
