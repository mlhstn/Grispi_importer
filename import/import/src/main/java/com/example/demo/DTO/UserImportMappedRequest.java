package com.example.demo.DTO;

import java.util.List;
import java.util.Map;


public class UserImportMappedRequest {
    private List<Map<String, Object>> rows;
    private Map<String, String> columnMappings; // örnek: "firstName" → "Ad", "lastName" → "Soyad"

    public UserImportMappedRequest() {

    }

    public UserImportMappedRequest(List<Map<String, Object>> rows, Map<String, String> columnMappings) {
        this.rows = rows;
        this.columnMappings = columnMappings;
    }

    public List<Map<String, Object>> getRows() {
        return rows;
    }

    public void setRows(List<Map<String, Object>> rows) {
        this.rows = rows;
    }

    public Map<String, String> getColumnMappings() {
        return columnMappings;
    }

    public void setColumnMappings(Map<String, String> columnMappings) {
        this.columnMappings = columnMappings;
    }
}
