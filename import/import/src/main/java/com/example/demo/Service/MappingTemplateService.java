package com.example.demo.Service;

import com.example.demo.Entity.MappingTemplate;
import com.example.demo.Repository.MappingTemplateRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MappingTemplateService {
    
    private final MappingTemplateRepository mappingTemplateRepository;
    private final ObjectMapper objectMapper;
    
    @Autowired
    public MappingTemplateService(MappingTemplateRepository mappingTemplateRepository, ObjectMapper objectMapper) {
        this.mappingTemplateRepository = mappingTemplateRepository;
        this.objectMapper = objectMapper;
    }
    
    /**
     * Yeni mapping şablonu kaydet
     */
    public MappingTemplate saveTemplate(String name, String importType, List<Map<String, Object>> mappings, String createdBy, String description) {
        try {
            String mappingsJson = objectMapper.writeValueAsString(mappings);
            
            MappingTemplate template = new MappingTemplate(name, importType, mappingsJson, createdBy);
            template.setDescription(description);
            
            return mappingTemplateRepository.save(template);
        } catch (Exception e) {
            throw new RuntimeException("Şablon kaydedilirken hata oluştu: " + e.getMessage());
        }
    }
    
    /**
     * Şablonu güncelle
     */
    public MappingTemplate updateTemplate(Long id, String name, List<Map<String, Object>> mappings, String description) {
        Optional<MappingTemplate> optional = mappingTemplateRepository.findById(id);
        if (optional.isPresent()) {
            MappingTemplate template = optional.get();
            template.setName(name);
            template.setDescription(description);
            
            try {
                String mappingsJson = objectMapper.writeValueAsString(mappings);
                template.setMappingsJson(mappingsJson);
            } catch (Exception e) {
                throw new RuntimeException("Şablon güncellenirken hata oluştu: " + e.getMessage());
            }
            
            return mappingTemplateRepository.save(template);
        } else {
            throw new RuntimeException("Şablon bulunamadı: " + id);
        }
    }
    
    /**
     * Import türüne göre şablonları getir
     */
    public List<MappingTemplate> getTemplatesByImportType(String importType) {
        return mappingTemplateRepository.findByImportTypeAndIsActiveTrueOrderByNameAsc(importType);
    }
    
    /**
     * Import türüne göre varsayılan şablonu getir
     */
    public Optional<MappingTemplate> getDefaultTemplate(String importType) {
        return mappingTemplateRepository.findByImportTypeAndIsDefaultTrueAndIsActiveTrue(importType);
    }
    
    /**
     * Şablonu ID ile getir
     */
    public Optional<MappingTemplate> getTemplateById(Long id) {
        return mappingTemplateRepository.findById(id);
    }
    
    /**
     * Şablonu JSON'dan parse et
     */
    public List<Map<String, Object>> parseMappingsFromTemplate(MappingTemplate template) {
        try {
            return objectMapper.readValue(template.getMappingsJson(), new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Şablon parse edilirken hata oluştu: " + e.getMessage());
        }
    }
    
    /**
     * Şablonu varsayılan yap
     */
    public MappingTemplate setAsDefault(Long id) {
        Optional<MappingTemplate> optional = mappingTemplateRepository.findById(id);
        if (optional.isPresent()) {
            MappingTemplate template = optional.get();
            
            // Aynı import türündeki diğer şablonları varsayılan olmaktan çıkar
            List<MappingTemplate> sameTypeTemplates = mappingTemplateRepository.findByImportType(template.getImportType());
            for (MappingTemplate t : sameTypeTemplates) {
                if (t.getIsDefault()) {
                    t.setIsDefault(false);
                    mappingTemplateRepository.save(t);
                }
            }
            
            // Bu şablonu varsayılan yap
            template.setIsDefault(true);
            return mappingTemplateRepository.save(template);
        } else {
            throw new RuntimeException("Şablon bulunamadı: " + id);
        }
    }
    
    /**
     * Şablonu sil (soft delete)
     */
    public void deleteTemplate(Long id) {
        Optional<MappingTemplate> optional = mappingTemplateRepository.findById(id);
        if (optional.isPresent()) {
            MappingTemplate template = optional.get();
            template.setIsActive(false);
            mappingTemplateRepository.save(template);
        }
    }
    
    /**
     * Şablon ara
     */
    public List<MappingTemplate> searchTemplates(String name) {
        return mappingTemplateRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name);
    }
    
    /**
     * Tüm aktif şablonları getir
     */
    public List<MappingTemplate> getAllActiveTemplates() {
        return mappingTemplateRepository.findByIsActiveTrue();
    }
}
