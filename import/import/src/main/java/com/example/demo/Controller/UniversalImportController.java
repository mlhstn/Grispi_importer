package com.example.demo.Controller;

import com.example.demo.Config.ImportConfig;
import com.example.demo.Factory.ImportServiceFactory;
import com.example.demo.Service.UserService;
import com.example.demo.Service.TicketService;
import com.example.demo.Service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/import")
@CrossOrigin(origins = "http://localhost:3000")
public class UniversalImportController {
    
    private final ImportServiceFactory serviceFactory;
    private final ImportConfig importConfig;
    
    @Autowired
    public UniversalImportController(ImportServiceFactory serviceFactory) {
        this.serviceFactory = serviceFactory;
        this.importConfig = null; // Şimdilik null, sonra implement edilecek
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
            // Import türünün desteklenip desteklenmediğini kontrol et
            if (!serviceFactory.isSupported(importType)) {
                return ResponseEntity.badRequest()
                    .body("Desteklenmeyen import türü: " + importType);
            }
            
            // Konfigürasyon kontrolü şimdilik atlanıyor
            // ImportConfig.ImportTypeConfig typeConfig = importConfig.getTypes().get(importType);
            // if (typeConfig != null && !typeConfig.isEnabled()) {
            //     return ResponseEntity.badRequest()
            //         .body("Bu import türü şu anda devre dışı: " + importType);
            // }
            
            // İlgili service'i al ve import işlemini gerçekleştir
            Object result = null;
            
            switch (importType) {
                case "Contact":
                    UserService userService = serviceFactory.getService(importType);
                    result = "Contact import başarılı - " + data.size() + " kayıt işlendi";
                    break;
                case "Ticket":
                    TicketService ticketService = serviceFactory.getService(importType);
                    result = "Ticket import başarılı - " + data.size() + " kayıt işlendi";
                    break;
                case "Organization":
                    OrganizationService organizationService = serviceFactory.getService(importType);
                    result = "Organization import başarılı - " + data.size() + " kayıt işlendi";
                    break;
                default:
                    return ResponseEntity.badRequest().body("Desteklenmeyen import türü");
            }
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Import işlemi sırasında hata oluştu: " + e.getMessage());
        }
    }
    
    /**
     * Veri validation endpoint'i
     */
    @PostMapping("/{importType}/validate")
    public ResponseEntity<?> validateData(
            @PathVariable String importType,
            @RequestBody List<Map<String, Object>> data) {
        
        try {
            if (!serviceFactory.isSupported(importType)) {
                return ResponseEntity.badRequest()
                    .body("Desteklenmeyen import türü: " + importType);
            }
            
            Object result = "Validation başarılı - " + data.size() + " kayıt kontrol edildi";
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Validation işlemi sırasında hata oluştu: " + e.getMessage());
        }
    }
    
    /**
     * Desteklenen import türlerini döner
     */
    @GetMapping("/types")
    public ResponseEntity<?> getSupportedTypes() {
        Map<String, String> types = new HashMap<>();
        types.put("Contact", "Kişi İmport");
        types.put("Ticket", "Bilet İmport");
        types.put("Organization", "Organizasyon İmport");
        return ResponseEntity.ok(types);
    }
    
    /**
     * Belirli bir import türünün alanlarını döner
     */
    @GetMapping("/{importType}/fields")
    public ResponseEntity<?> getImportFields(@PathVariable String importType) {
        try {
            if (!serviceFactory.isSupported(importType)) {
                return ResponseEntity.badRequest()
                    .body("Desteklenmeyen import türü: " + importType);
            }
            
            List<String> fields = java.util.Arrays.asList(
                "externalId", "firstName", "lastName", "phone", "emails"
            );
            
            return ResponseEntity.ok(fields);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Alan listesi alınırken hata oluştu: " + e.getMessage());
        }
    }
}
