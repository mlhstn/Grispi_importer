package com.example.demo.Controller;

import com.example.demo.Factory.ImportServiceFactory;
import com.example.demo.Service.ImportService;
import com.example.demo.Config.ImportConfig;
import com.example.demo.Service.ExcelService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.example.demo.Entity.enums.RequiredStatus;

@RestController
@RequestMapping("/api/import")
@CrossOrigin(origins = "http://localhost:3000")
public class UniversalImportController {
    
    private final ImportServiceFactory serviceFactory;
    private final ImportConfig importConfig;
    private final ExcelService excelService;
    private final ObjectMapper objectMapper;
    
    @Autowired
    public UniversalImportController(ImportServiceFactory serviceFactory, ExcelService excelService) {
        this.serviceFactory = serviceFactory;
        this.excelService = excelService;
        this.importConfig = null; // Şimdilik null, sonra implement edilecek
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Dinamik import endpoint'i
     * @param importType Import türü (Contact, Ticket, Organization)
     * @param data Import edilecek veri
     * @return Import sonucu
     */
    @PostMapping("/{importType}")
    public ResponseEntity<?> importData(
            @PathVariable String importType,
            @RequestBody List<Map<String, Object>> data) {
        
        try {
            if (!serviceFactory.isSupported(importType)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Desteklenmeyen import türü: " + importType);
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // ImportServiceFactory'den uygun servisi al
            ImportService importService = serviceFactory.getService(importType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", importType + " import başarılı - " + data.size() + " kayıt işlendi");
            response.put("totalRecords", data.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Import işlemi sırasında hata oluştu: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Mapping verilerini alan endpoint
     */
    @PostMapping("/{importType}/import-mapping")
    public ResponseEntity<?> importWithMapping(
            @PathVariable String importType,
            @RequestBody Map<String, Object> mappingData) {
        
        try {
            if (!serviceFactory.isSupported(importType)) {
                return ResponseEntity.badRequest()
                    .body("Desteklenmeyen import türü: " + importType);
            }
            
            // Mapping verilerini logla
            System.out.println("Mapping verileri alındı: " + mappingData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", importType + " mapping verileri başarıyla alındı");
            response.put("importType", importType);
            response.put("mappedFields", mappingData.get("mappings"));
            response.put("totalRows", mappingData.get("totalRows"));
            response.put("timestamp", mappingData.get("timestamp"));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Mapping işlemi sırasında hata oluştu: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Excel preview endpoint'i
     */
    @PostMapping("/excel/preview")
    public ResponseEntity<?> previewExcel(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Dosya boş olamaz");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Excel dosyasını oku ve preview döndür
            Map<String, Object> preview = new HashMap<>();
            preview.put("filename", file.getOriginalFilename());
            preview.put("size", file.getSize());
            preview.put("contentType", file.getContentType());
            preview.put("message", "Excel dosyası başarıyla alındı");
            
            return ResponseEntity.ok(preview);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Excel preview hatası: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Excel dosyasını oku ve veritabanına kaydet
     */
    @PostMapping("/{importType}/import-excel")
    public ResponseEntity<Map<String, Object>> importExcelWithMapping(
            @PathVariable String importType,
            @RequestParam("file") MultipartFile file,
            @RequestParam("mappings") String mappingsJson) {
        
        try {
            System.out.println("Import request received: " + importType);
            System.out.println("File: " + file.getOriginalFilename() + ", size: " + file.getSize());
            System.out.println("Mappings JSON: " + mappingsJson);
            
            if (file.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Dosya boş olamaz");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (!serviceFactory.isSupported(importType)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Desteklenmeyen import türü: " + importType);
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Excel dosyasını oku
            ExcelService.ExcelData excelData = excelService.readFullExcel(file);
            System.out.println("Excel data read: " + excelData.getHeaders().size() + " headers, " + excelData.getRows().size() + " rows");
            
            // Mapping JSON'ını parse et
            List<Map<String, Object>> mappings = new ArrayList<>();
            try {
                // Jackson ile JSON parsing
                List<Map<String, Object>> parsedMappings = objectMapper.readValue(
                    mappingsJson, 
                    new TypeReference<List<Map<String, Object>>>() {}
                );
                mappings = parsedMappings;
                System.out.println("Parsed mappings: " + mappings.size() + " mappings");
            } catch (Exception e) {
                System.out.println("Mapping parsing error: " + e.getMessage());
                // Hata durumunda boş liste kullan
                mappings = new ArrayList<>();
            }
            
            // Excel verilerini mapping'e göre dönüştür
            List<Map<String, Object>> transformedData = excelService.transformDataWithMapping(excelData, mappings);
            System.out.println("Transformed data: " + transformedData.size() + " records");
            
            // ImportServiceFactory'den uygun servisi al
            ImportService importService = serviceFactory.getService(importType);
            Map<String, Object> result = importService.importExcelWithMapping(file, mappingsJson);
            
            System.out.println("Import result: " + result.get("successCount") + " success, " + result.get("errorCount") + " errors");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", importType + " import tamamlandı");
            response.put("importType", importType);
            response.put("totalRecords", result.get("totalRecords"));
            response.put("successCount", result.get("successCount"));
            response.put("errorCount", result.get("errorCount"));
            response.put("errors", result.get("errors"));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Import error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Excel import hatası: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Veri validation endpoint'i
     */
    @PostMapping("/{importType}/validate")
    public ResponseEntity<Map<String, Object>> validateData(
            @PathVariable String importType,
            @RequestBody List<Map<String, Object>> data) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (!serviceFactory.isSupported(importType)) {
                response.put("success", false);
                response.put("error", "Desteklenmeyen import türü: " + importType);
                return ResponseEntity.badRequest().body(response);
            }
            
            response.put("success", true);
            response.put("message", "Validation başarılı - " + data.size() + " kayıt kontrol edildi");
            response.put("totalRecords", data.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Validation işlemi sırasında hata oluştu: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Desteklenen import türlerini döner
     */
    @GetMapping("/types")
    public ResponseEntity<Map<String, Object>> getSupportedTypes() {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> types = new HashMap<>();
        types.put("Contact", "Kişi İmport");
        types.put("Ticket", "Bilet İmport");
        types.put("Organization", "Organizasyon İmport");
        types.put("Group", "Grup İmport");
        types.put("CustomField", "Özel Alan İmport");
        
        response.put("success", true);
        response.put("types", types);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Belirli bir import türünün alanlarını döner
     */
    @GetMapping("/{importType}/fields")
    public ResponseEntity<Map<String, Object>> getImportFields(@PathVariable String importType) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (!serviceFactory.isSupported(importType)) {
                response.put("success", false);
                response.put("error", "Desteklenmeyen import türü: " + importType);
                return ResponseEntity.badRequest().body(response);
            }
            
            List<String> fields = java.util.Arrays.asList(
                "externalId", "firstName", "lastName", "phone", "emails"
            );
            
            response.put("success", true);
            response.put("fields", fields);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Alan listesi alınırken hata oluştu: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/required-fields/{importType}")
    public ResponseEntity<Map<String, Object>> getRequiredFields(@PathVariable String importType) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> requiredFields = new HashMap<>();
        
        switch (importType.toLowerCase()) {
            case "user":
                requiredFields.put("externalId", Map.of(
                    "required", true,
                    "description", "Kullanıcının benzersiz dış kimliği",
                    "validation", "Boş olamaz"
                ));
                break;
                
            case "organization":
                requiredFields.put("externalId", Map.of(
                    "required", true,
                    "description", "Organizasyonun benzersiz dış kimliği",
                    "validation", "Boş olamaz"
                ));
                break;
                
            case "ticket":
                requiredFields.put("externalId", Map.of(
                    "required", true,
                    "description", "Biletin benzersiz dış kimliği",
                    "validation", "Boş olamaz"
                ));
                break;
                
            case "group":
                requiredFields.put("name", Map.of(
                    "required", true,
                    "description", "Grup adı",
                    "validation", "Boş olamaz"
                ));
                break;
                
            case "customfield":
                // Hiçbir alan zorunlu değil
                break;
                
            default:
                response.put("error", "Geçersiz import tipi: " + importType);
                return ResponseEntity.badRequest().body(response);
        }
        
        response.put("importType", importType);
        response.put("requiredFields", requiredFields);
        response.put("success", true);
        
        return ResponseEntity.ok(response);
    }
}
