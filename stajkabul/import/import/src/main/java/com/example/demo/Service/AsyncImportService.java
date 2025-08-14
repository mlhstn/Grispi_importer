package com.example.demo.Service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;

@Service
public class AsyncImportService {
    
    private final Map<String, ImportProgress> progressMap = new ConcurrentHashMap<>();
    
    public static class ImportProgress {
        private String id;
        private String status; // PENDING, PROCESSING, COMPLETED, FAILED
        private int totalRows;
        private int processedRows;
        private int successCount;
        private int errorCount;
        private String message;
        private Object result;
        
        public ImportProgress(String id) {
            this.id = id;
            this.status = "PENDING";
        }
        
        // Getters and setters
        public String getId() { return id; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public int getTotalRows() { return totalRows; }
        public void setTotalRows(int totalRows) { this.totalRows = totalRows; }
        public int getProcessedRows() { return processedRows; }
        public void setProcessedRows(int processedRows) { this.processedRows = processedRows; }
        public int getSuccessCount() { return successCount; }
        public void setSuccessCount(int successCount) { this.successCount = successCount; }
        public int getErrorCount() { return errorCount; }
        public void setErrorCount(int errorCount) { this.errorCount = errorCount; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Object getResult() { return result; }
        public void setResult(Object result) { this.result = result; }
        
        public double getProgress() {
            if (totalRows == 0) return 0.0;
            return (double) processedRows / totalRows * 100.0;
        }
    }
    
    /**
     * Asenkron import işlemi başlatır
     */
    public String startAsyncImport(String importType, List<Map<String, Object>> data) {
        String importId = UUID.randomUUID().toString();
        ImportProgress progress = new ImportProgress(importId);
        progress.setTotalRows(data.size());
        progressMap.put(importId, progress);
        
        // Asenkron işlemi başlat
        processImportAsync(importId, importType, data);
        
        return importId;
    }
    
    /**
     * Import durumunu döner
     */
    public ImportProgress getImportProgress(String importId) {
        return progressMap.get(importId);
    }
    
    /**
     * Tüm aktif import'ları döner
     */
    public Map<String, ImportProgress> getAllActiveImports() {
        return new ConcurrentHashMap<>(progressMap);
    }
    
    /**
     * Import işlemini iptal eder
     */
    public boolean cancelImport(String importId) {
        ImportProgress progress = progressMap.get(importId);
        if (progress != null && "PROCESSING".equals(progress.getStatus())) {
            progress.setStatus("CANCELLED");
            progress.setMessage("İşlem kullanıcı tarafından iptal edildi");
            return true;
        }
        return false;
    }
    
    @Async
    protected CompletableFuture<Void> processImportAsync(String importId, String importType, List<Map<String, Object>> data) {
        ImportProgress progress = progressMap.get(importId);
        
        try {
            progress.setStatus("PROCESSING");
            progress.setMessage("İşlem başlatıldı...");
            
            // Batch işleme
            int batchSize = 100;
            int successCount = 0;
            int errorCount = 0;
            
            for (int i = 0; i < data.size(); i += batchSize) {
                // İptal kontrolü
                if ("CANCELLED".equals(progress.getStatus())) {
                    break;
                }
                
                int endIndex = Math.min(i + batchSize, data.size());
                List<Map<String, Object>> batch = data.subList(i, endIndex);
                
                try {
                    // Batch'i işle (burada gerçek import service'i çağrılacak)
                    processBatch(importType, batch);
                    successCount += batch.size();
                    
                } catch (Exception e) {
                    errorCount += batch.size();
                    System.err.println("Batch işleme hatası: " + e.getMessage());
                }
                
                // Progress güncelle
                progress.setProcessedRows(endIndex);
                progress.setSuccessCount(successCount);
                progress.setErrorCount(errorCount);
                progress.setMessage("İşlenen: " + endIndex + "/" + data.size());
                
                // Kısa bekle (CPU'yu rahatlatmak için)
                Thread.sleep(10);
            }
            
            // Sonucu belirle
            if ("CANCELLED".equals(progress.getStatus())) {
                progress.setMessage("İşlem iptal edildi");
            } else if (errorCount == 0) {
                progress.setStatus("COMPLETED");
                progress.setMessage("Tüm kayıtlar başarıyla işlendi");
            } else if (successCount > 0) {
                progress.setStatus("COMPLETED");
                progress.setMessage(successCount + " başarılı, " + errorCount + " hatalı");
            } else {
                progress.setStatus("FAILED");
                progress.setMessage("Hiçbir kayıt işlenemedi");
            }
            
        } catch (Exception e) {
            progress.setStatus("FAILED");
            progress.setMessage("İşlem hatası: " + e.getMessage());
            System.err.println("Async import hatası: " + e.getMessage());
        }
        
        return CompletableFuture.completedFuture(null);
    }
    
    private void processBatch(String importType, List<Map<String, Object>> batch) throws Exception {
        // Burada gerçek import işlemi yapılacak
        // ImportServiceFactory kullanılarak ilgili service çağrılabilir
        
        // Simülasyon için kısa bekle
        Thread.sleep(50);
        
        // Rastgele hata simülasyonu (test için)
        if (Math.random() < 0.05) { // %5 hata oranı
            throw new Exception("Simüle edilmiş batch hatası");
        }
    }
}
