package com.example.demo.Plugin;

import java.util.List;
import java.util.Map;

/**
 * Import plugin'leri için temel interface
 */
public interface ImportPluginInterface<T> {
    
    /**
     * Plugin'in adını döner
     */
    String getName();
    
    /**
     * Plugin'in versiyonunu döner
     */
    String getVersion();
    
    /**
     * Plugin'in desteklediği entity tipini döner
     */
    Class<T> getEntityType();
    
    /**
     * Plugin'i başlatır
     */
    void initialize();
    
    /**
     * Plugin'i kapatır
     */
    void destroy();
    
    /**
     * Veriyi entity'ye dönüştürür
     */
    T mapToEntity(Map<String, Object> data);
    
    /**
     * Entity'yi validate eder
     */
    PluginValidationResult validate(T entity);
    
    /**
     * Batch import işlemi yapar
     */
    PluginImportResult<T> importBatch(List<Map<String, Object>> data);
    
    /**
     * Desteklenen alanları döner
     */
    List<String> getSupportedFields();
    
    /**
     * Plugin konfigürasyonunu döner
     */
    PluginConfig getConfig();
}

/**
 * Plugin validation sonucu
 */
class PluginValidationResult {
    private final boolean valid;
    private final List<String> errors;
    private final List<String> warnings;
    
    public PluginValidationResult(boolean valid, List<String> errors, List<String> warnings) {
        this.valid = valid;
        this.errors = errors;
        this.warnings = warnings;
    }
    
    public boolean isValid() { return valid; }
    public List<String> getErrors() { return errors; }
    public List<String> getWarnings() { return warnings; }
}

/**
 * Plugin import sonucu
 */
class PluginImportResult<T> {
    private final List<T> successful;
    private final List<PluginImportError> failed;
    private final int totalProcessed;
    
    public PluginImportResult(List<T> successful, List<PluginImportError> failed, int totalProcessed) {
        this.successful = successful;
        this.failed = failed;
        this.totalProcessed = totalProcessed;
    }
    
    public List<T> getSuccessful() { return successful; }
    public List<PluginImportError> getFailed() { return failed; }
    public int getTotalProcessed() { return totalProcessed; }
    public int getSuccessCount() { return successful.size(); }
    public int getFailedCount() { return failed.size(); }
}

/**
 * Plugin import hatası
 */
class PluginImportError {
    private final int rowIndex;
    private final String message;
    private final Map<String, Object> originalData;
    private final Throwable cause;
    
    public PluginImportError(int rowIndex, String message, Map<String, Object> originalData, Throwable cause) {
        this.rowIndex = rowIndex;
        this.message = message;
        this.originalData = originalData;
        this.cause = cause;
    }
    
    public int getRowIndex() { return rowIndex; }
    public String getMessage() { return message; }
    public Map<String, Object> getOriginalData() { return originalData; }
    public Throwable getCause() { return cause; }
}

/**
 * Plugin konfigürasyonu
 */
class PluginConfig {
    private final String name;
    private final String displayName;
    private final String description;
    private final boolean enabled;
    private final Map<String, Object> settings;
    
    public PluginConfig(String name, String displayName, String description, boolean enabled, Map<String, Object> settings) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.enabled = enabled;
        this.settings = settings;
    }
    
    public String getName() { return name; }
    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
    public boolean isEnabled() { return enabled; }
    public Map<String, Object> getSettings() { return settings; }
}
