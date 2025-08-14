package com.example.demo.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "import")
public class ImportConfig {
    
    private Map<String, ImportTypeConfig> types;
    private ValidationConfig validation;
    private ProcessingConfig processing;
    
    public static class ImportTypeConfig {
        private String name;
        private String displayName;
        private String description;
        private String apiEndpoint;
        private String validationEndpoint;
        private List<FieldConfig> fields;
        private boolean enabled;
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getApiEndpoint() { return apiEndpoint; }
        public void setApiEndpoint(String apiEndpoint) { this.apiEndpoint = apiEndpoint; }
        
        public String getValidationEndpoint() { return validationEndpoint; }
        public void setValidationEndpoint(String validationEndpoint) { this.validationEndpoint = validationEndpoint; }
        
        public List<FieldConfig> getFields() { return fields; }
        public void setFields(List<FieldConfig> fields) { this.fields = fields; }
        
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }
    
    public static class FieldConfig {
        private String name;
        private String label;
        private String type;
        private boolean required;
        private ValidationRule validation;
        private String description;
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public boolean isRequired() { return required; }
        public void setRequired(boolean required) { this.required = required; }
        
        public ValidationRule getValidation() { return validation; }
        public void setValidation(ValidationRule validation) { this.validation = validation; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
    
    public static class ValidationRule {
        private String pattern;
        private Integer minLength;
        private Integer maxLength;
        private List<String> allowedValues;
        
        // Getters and Setters
        public String getPattern() { return pattern; }
        public void setPattern(String pattern) { this.pattern = pattern; }
        
        public Integer getMinLength() { return minLength; }
        public void setMinLength(Integer minLength) { this.minLength = minLength; }
        
        public Integer getMaxLength() { return maxLength; }
        public void setMaxLength(Integer maxLength) { this.maxLength = maxLength; }
        
        public List<String> getAllowedValues() { return allowedValues; }
        public void setAllowedValues(List<String> allowedValues) { this.allowedValues = allowedValues; }
    }
    
    public static class ValidationConfig {
        private boolean strictMode;
        private int maxErrors;
        private boolean skipInvalidRows;
        
        // Getters and Setters
        public boolean isStrictMode() { return strictMode; }
        public void setStrictMode(boolean strictMode) { this.strictMode = strictMode; }
        
        public int getMaxErrors() { return maxErrors; }
        public void setMaxErrors(int maxErrors) { this.maxErrors = maxErrors; }
        
        public boolean isSkipInvalidRows() { return skipInvalidRows; }
        public void setSkipInvalidRows(boolean skipInvalidRows) { this.skipInvalidRows = skipInvalidRows; }
    }
    
    public static class ProcessingConfig {
        private int batchSize;
        private int threadPoolSize;
        private long timeoutMs;
        
        // Getters and Setters
        public int getBatchSize() { return batchSize; }
        public void setBatchSize(int batchSize) { this.batchSize = batchSize; }
        
        public int getThreadPoolSize() { return threadPoolSize; }
        public void setThreadPoolSize(int threadPoolSize) { this.threadPoolSize = threadPoolSize; }
        
        public long getTimeoutMs() { return timeoutMs; }
        public void setTimeoutMs(long timeoutMs) { this.timeoutMs = timeoutMs; }
    }
    
    // Main class getters and setters
    public Map<String, ImportTypeConfig> getTypes() { return types; }
    public void setTypes(Map<String, ImportTypeConfig> types) { this.types = types; }
    
    public ValidationConfig getValidation() { return validation; }
    public void setValidation(ValidationConfig validation) { this.validation = validation; }
    
    public ProcessingConfig getProcessing() { return processing; }
    public void setProcessing(ProcessingConfig processing) { this.processing = processing; }
}
