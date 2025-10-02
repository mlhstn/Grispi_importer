package com.example.demo.Controller;

import com.example.demo.Service.ExcelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/excel")
@CrossOrigin(origins = "http://localhost:3000")
public class ExcelController {

    private final ExcelService excelService;

    public ExcelController(ExcelService excelService) {
        this.excelService = excelService;
    }

    @PostMapping("/preview")
    public ResponseEntity<Map<String, Object>> previewExcel(@RequestParam("file") MultipartFile file) {
        try {
            // İlk 5 satırı önizleme için alıyoruz
            Map<String, Object> previewData = (Map) excelService.readExcelPreview(file, 5);
            return ResponseEntity.ok(previewData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dosya okunamadı: " + e.getMessage()));
        }
    }
}
