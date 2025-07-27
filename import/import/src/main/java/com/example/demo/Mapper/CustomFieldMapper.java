package com.example.demo.Mapper;

import com.example.demo.Entity.CustomField;
import com.example.demo.Entity.Group;
import com.example.demo.Entity.enums.CustomFieldType;
import com.example.demo.Entity.enums.PermissionLevel;
import com.example.demo.Repository.GroupRepository;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CustomFieldMapper {

    private final GroupRepository groupRepository;

    public CustomFieldMapper(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public CustomField mapToCustomField(Map<String, Object> row) {
        CustomField field = new CustomField();

        // Key
        Object keyObj = row.get("key");
        if (keyObj != null) {
            field.setKey(keyObj.toString().trim());
        }

        // Type
        Object typeObj = row.get("type");
        if (typeObj != null) {
            try {
                field.setType(CustomFieldType.valueOf(typeObj.toString().trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Geçersiz değer varsa null olarak bırakıyoruz
                field.setType(null);
            }
        }

        // Permission
        Object permObj = row.get("permission");
        if (permObj != null) {
            try {
                field.setPermission(PermissionLevel.valueOf(permObj.toString().trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                field.setPermission(null);
            }
        }

        field.setName((String) row.get("name"));
        field.setDescription((String) row.get("description"));
        field.setDescriptionForAgents((String) row.get("description_for_agents"));
        field.setDescriptionForCustomers((String) row.get("description_for_customers"));
        field.setTitleForAgents((String) row.get("title_for_agents"));
        field.setTitleForCustomers((String) row.get("title_for_customers"));

        field.setEnabled(Boolean.parseBoolean(String.valueOf(row.getOrDefault("enabled", "false"))));
        field.setRequired(Boolean.parseBoolean(String.valueOf(row.getOrDefault("required", "false"))));

        // Opsiyonlar
        String optionsStr = (String) row.get("options");
        if (optionsStr != null && !optionsStr.trim().isEmpty()) {
            List<String> options = Arrays.asList(optionsStr.split("\\$"));
            field.setOptions(new ArrayList<>(options));
        }

        // Gruplar
        Object groupObj = row.get("groups");
        if (groupObj instanceof List<?>) {
            List<Group> groups = new ArrayList<>();
            for (Object item : (List<?>) groupObj) {
                String groupName = item.toString().trim();
                Group group = groupRepository.findByName(groupName);
                if (group != null) groups.add(group);
            }
            field.setGroups(groups);
        }

        return field;
    }
}
