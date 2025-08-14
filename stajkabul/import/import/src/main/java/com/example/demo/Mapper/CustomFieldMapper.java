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

    public CustomField mapWithMapping(Map<String, Object> row, Map<String, String> mappings) {
        CustomField field = new CustomField();

        // Frontend'den gelen mapping formatı: excelColumn -> grispiField
        // Backend'de beklenen format: grispiField -> excelColumn
        // Bu yüzden mapping'i tersine çeviriyoruz
        Map<String, String> reverseMappings = new HashMap<>();
        for (Map.Entry<String, String> entry : mappings.entrySet()) {
            reverseMappings.put(entry.getValue(), entry.getKey());
        }

        for (Map.Entry<String, String> entry : reverseMappings.entrySet()) {
            String grispiField = entry.getKey();
            String excelColumn = entry.getValue();
            Object rawValue = row.get(excelColumn);

            if (rawValue == null || rawValue.toString().trim().isEmpty()) continue;

            String value = rawValue.toString().trim();

            switch (grispiField) {
                case "key":
                    field.setKey(value);
                    break;
                case "type":
                    try {
                        // Excel'deki değerleri enum'a çevir
                        String typeValue = value.toUpperCase();
                        switch (typeValue) {
                            case "TEXT":
                                field.setType(CustomFieldType.TEXT);
                                break;
                            case "NUMBER":
                                field.setType(CustomFieldType.NUMBER);
                                break;
                            case "DATE":
                                field.setType(CustomFieldType.DATE);
                                break;
                            case "CHECKBOX":
                                field.setType(CustomFieldType.CHECKBOX);
                                break;
                            case "DROPDOWN":
                                field.setType(CustomFieldType.DROPDOWN);
                                break;
                            default:
                                field.setType(CustomFieldType.TEXT); // Varsayılan
                                break;
                        }
                    } catch (IllegalArgumentException ignored) {
                        field.setType(CustomFieldType.TEXT); // Varsayılan
                    }
                    break;
                case "name":
                    field.setName(value);
                    break;
                case "description":
                    field.setDescription(value);
                    break;
                case "permission":
                    try {
                        // Excel'deki "Read-Write" değerini enum'a çevir
                        String permValue = value.toUpperCase();
                        switch (permValue) {
                            case "READ-WRITE":
                            case "READ_WRITE":
                                field.setPermission(PermissionLevel.EDITABLE_BY_END_USERS);
                                break;
                            case "READ-ONLY":
                            case "READONLY":
                                field.setPermission(PermissionLevel.READONLY);
                                break;
                            case "AGENT_ONLY":
                                field.setPermission(PermissionLevel.AGENT_ONLY);
                                break;
                            case "CUSTOMER_ONLY":
                                field.setPermission(PermissionLevel.CUSTOMER_ONLY);
                                break;
                            default:
                                field.setPermission(PermissionLevel.EDITABLE_BY_END_USERS); // Varsayılan
                                break;
                        }
                    } catch (IllegalArgumentException ignored) {
                        field.setPermission(PermissionLevel.EDITABLE_BY_END_USERS); // Varsayılan
                    }
                    break;
                case "required":
                    // Türkçe "DOĞRU"/"YANLIŞ" değerlerini boolean'a çevir
                    String requiredValue = value.toLowerCase();
                    if (requiredValue.equals("doğru") || requiredValue.equals("true") || requiredValue.equals("1")) {
                        field.setRequired(true);
                    } else {
                        field.setRequired(false);
                    }
                    break;
                case "descriptionForAgents":
                    field.setDescriptionForAgents(value);
                    break;
                case "descriptionForCustomers":
                    field.setDescriptionForCustomers(value);
                    break;
                case "titleForAgents":
                    field.setTitleForAgents(value);
                    break;
                case "titleForCustomers":
                    field.setTitleForCustomers(value);
                    break;
                case "enabled":
                    field.setEnabled(Boolean.parseBoolean(value));
                    break;
                case "options":
                    List<String> options = Arrays.asList(value.split("\\$"));
                    field.setOptions(new ArrayList<>(options));
                    break;
                default:
                    // bilinmeyen alanlar
                    break;
            }
        }

        // Varsayılan değerler (sadece mapping'de olmayan alanlar için)
        if (field.getOptions() == null) {
            field.setOptions(new ArrayList<>()); // Boş options listesi
        }
        field.setGroups(new ArrayList<>()); // Boş groups listesi

        return field;
    }
}
