package com.example.demo.DTO;

import java.util.List;
import java.util.Map;

public class UserImportRequest {
    private List<Map<String, Object>> data; // Excel'den gelen satırlar
    private List<Map<String, Object>> columnMappings; // Grispi field -> Excel column adı eşleşmesi

    public List<Map<String, Object>> getData() {
        return data;
    }

    public void setData(List<Map<String, Object>> data) {
        this.data = data;
    }

    public List<Map<String, Object>> getColumnMappings() {
        return columnMappings;
    }

    public void setColumnMappings(List<Map<String, Object>> columnMappings) {
        this.columnMappings = columnMappings;
    }
}
