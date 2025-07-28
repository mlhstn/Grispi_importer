package com.example.demo.DTO;

import java.util.List;
import java.util.Map;

public class UserImportRequest {
    private List<Map<String, Object>> data; // Excel'den gelen satırlar
    private Map<String, String> columnMappings; // Grispi field -> Excel column adı eşleşmesi

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
