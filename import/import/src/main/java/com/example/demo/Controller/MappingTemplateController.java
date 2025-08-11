package com.example.demo.Controller;

import com.example.demo.Entity.MappingTemplate;
import com.example.demo.Service.MappingTemplateService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/mapping-templates")
@CrossOrigin(origins = "http://localhost:3000")
public class MappingTemplateController {
    
    private final MappingTemplateService mappingTemplateService;
    private final ObjectMapper objectMapper;
    
    @Autowired
    public MappingTemplateController(MappingTemplateService mappingTemplateService, ObjectMapper objectMapper) {
        this.mappingTemplateService = mappingTemplateService;
        this.objectMapper = objectMapper;
    }
    
    /**
     * Yeni şablon kaydet
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> saveTemplate(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String importType = (String) request.get("importType");
            String description = (String) request.get("description");
            String createdBy = (String) request.get("createdBy");
            List<Map<String, Object>> mappings = (List<Map<String, Object>>) request.get("mappings");
            
            MappingTemplate template = mappingTemplateService.saveTemplate(name, importType, mappings, createdBy, description);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Şablon başarıyla kaydedildi");
            response.put("template", template);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Import türüne göre şablonları getir
     */
    @GetMapping("/{importType}")
    public ResponseEntity<Map<String, Object>> getTemplatesByImportType(@PathVariable String importType) {
        try {
            List<MappingTemplate> templates = mappingTemplateService.getTemplatesByImportType(importType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("templates", templates);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Varsayılan şablonu getir
     */
    @GetMapping("/{importType}/default")
    public ResponseEntity<Map<String, Object>> getDefaultTemplate(@PathVariable String importType) {
        try {
            Optional<MappingTemplate> template = mappingTemplateService.getDefaultTemplate(importType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("template", template.orElse(null));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Şablonu ID ile getir
     */
    @GetMapping("/template/{id}")
    public ResponseEntity<Map<String, Object>> getTemplateById(@PathVariable Long id) {
        try {
            Optional<MappingTemplate> template = mappingTemplateService.getTemplateById(id);
            
            if (template.isPresent()) {
                // Mapping verilerini parse et
                List<Map<String, Object>> mappings = mappingTemplateService.parseMappingsFromTemplate(template.get());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("template", template.get());
                response.put("mappings", mappings);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("error", "Şablon bulunamadı");
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Şablonu güncelle
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTemplate(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String description = (String) request.get("description");
            List<Map<String, Object>> mappings = (List<Map<String, Object>>) request.get("mappings");
            
            MappingTemplate template = mappingTemplateService.updateTemplate(id, name, mappings, description);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Şablon başarıyla güncellendi");
            response.put("template", template);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Şablonu varsayılan yap
     */
    @PutMapping("/{id}/set-default")
    public ResponseEntity<Map<String, Object>> setAsDefault(@PathVariable Long id) {
        try {
            MappingTemplate template = mappingTemplateService.setAsDefault(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Şablon varsayılan olarak ayarlandı");
            response.put("template", template);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Şablonu sil
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTemplate(@PathVariable Long id) {
        try {
            mappingTemplateService.deleteTemplate(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Şablon başarıyla silindi");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Şablon ara
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchTemplates(@RequestParam String name) {
        try {
            List<MappingTemplate> templates = mappingTemplateService.searchTemplates(name);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("templates", templates);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Tüm aktif şablonları getir
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTemplates() {
        try {
            List<MappingTemplate> templates = mappingTemplateService.getAllActiveTemplates();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("templates", templates);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
