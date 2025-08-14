package com.example.demo.DTO;

import java.util.List;
import java.util.Map;

public class OrganizationImportRequest {
    private List<Map<String, Object>> data;
    private Map<String, String> columnMappings;

    public List<Map<String, Object>> getData() {
        return data;
    }

    public void setData(List<Map<String, Object>> data) {
        this.data = data;
    }

    public Map<String, String> getColumnMappings() {
        return columnMappings;
    }

    public void setColumnMappings(Map<String, String> columnMappings) {
        this.columnMappings = columnMappings;
    }
}
