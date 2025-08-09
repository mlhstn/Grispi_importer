package com.example.demo.Service;

import java.util.List;
import java.util.Map;

/**
 * Genel import işlemleri için interface
 * @param <T> Import edilecek entity tipi
 */
public interface ImportService<T> {
    
    /**
     * Veriyi import eder
     * @param data Import edilecek veri listesi
     * @return Import sonucu
     */
    ImportResult<T> importData(List<Map<String, Object>> data);
    
    /**
     * Tek bir kaydı validate eder
     * @param entity Validate edilecek entity
     * @return Validation sonucu
     */
    ValidationResult validate(T entity);
    
    /**
     * Veri listesini validate eder
     * @param data Validate edilecek veri listesi
     * @return Validation sonuçları
     */
    List<ValidationResult> validateData(List<Map<String, Object>> data);
    
    /**
     * Import türünün adını döner
     * @return Import türü adı
     */
    String getImportType();
    
    /**
     * Desteklenen alanları döner
     * @return Alan listesi
     */
    List<String> getSupportedFields();
}

/**
 * Import sonucu wrapper sınıfı
 */
class ImportResult<T> {
    private final List<T> successfulImports;
    private final List<ImportError> errors;
    private final int totalProcessed;
    
    public ImportResult(List<T> successfulImports, List<ImportError> errors, int totalProcessed) {
        this.successfulImports = successfulImports;
        this.errors = errors;
        this.totalProcessed = totalProcessed;
    }
    
    // Getters
    public List<T> getSuccessfulImports() { return successfulImports; }
    public List<ImportError> getErrors() { return errors; }
    public int getTotalProcessed() { return totalProcessed; }
    public int getSuccessCount() { return successfulImports.size(); }
    public int getErrorCount() { return errors.size(); }
}

/**
 * Validation sonucu sınıfı
 */
class ValidationResult {
    private final boolean valid;
    private final List<String> errors;
    private final Map<String, Object> originalData;
    
    public ValidationResult(boolean valid, List<String> errors, Map<String, Object> originalData) {
        this.valid = valid;
        this.errors = errors;
        this.originalData = originalData;
    }
    
    // Getters
    public boolean isValid() { return valid; }
    public List<String> getErrors() { return errors; }
    public Map<String, Object> getOriginalData() { return originalData; }
}

/**
 * Import hatası sınıfı
 */
class ImportError {
    private final int rowIndex;
    private final String message;
    private final Map<String, Object> originalData;
    private final Exception cause;
    
    public ImportError(int rowIndex, String message, Map<String, Object> originalData, Exception cause) {
        this.rowIndex = rowIndex;
        this.message = message;
        this.originalData = originalData;
        this.cause = cause;
    }
    
    // Getters
    public int getRowIndex() { return rowIndex; }
    public String getMessage() { return message; }
    public Map<String, Object> getOriginalData() { return originalData; }
    public Exception getCause() { return cause; }
}
