package com.example.demo.Mapper;

import com.example.demo.Entity.Group;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class GroupMapper {

    public Group mapToGroup(Map<String, Object> row, Map<String, String> mappings) {
        Group group = new Group();

        // Name zorunlu alan
        group.setName(getValueFromRow(row, mappings, "name"));

        return group;
    }

    public Group mapWithMapping(Map<String, Object> row, Map<String, String> mappings) {
        return mapToGroup(row, mappings);
    }

    private String getValueFromRow(Map<String, Object> row, Map<String, String> mappings, String grispiField) {
        // ExcelService zaten grispiField adını key olarak kullanıyor
        Object value = row.get(grispiField);
        return value != null ? value.toString().trim() : null;
    }
}
