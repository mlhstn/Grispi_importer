package com.example.demo.Mapper;

import com.example.demo.Entity.Group;
import com.example.demo.Entity.Organization;
import com.example.demo.Repository.GroupRepository;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class OrganizationMapper {

    private final GroupRepository groupRepository;

    public OrganizationMapper(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public Organization mapToOrganization(Map<String, Object> row, Map<String, String> mappings) {
        Organization org = new Organization();

        org.setExternalId(getValueFromRow(row, mappings, "externalId"));
        org.setName(getValueFromRow(row, mappings, "name"));
        org.setDescription(getValueFromRow(row, mappings, "description"));
        org.setDetails(getValueFromRow(row, mappings, "details"));
        org.setNotes(getValueFromRow(row, mappings, "notes"));

        // Group
        String groupName = getValueFromRow(row, mappings, "group");
        if (groupName != null && !groupName.isBlank()) {
            Group group = groupRepository.findByName(groupName);
            if (group != null) org.setGroup(group);
        }

        // Domains (virgülle ayrılmış)
        String domainsStr = getValueFromRow(row, mappings, "domains");
        if (domainsStr != null) {
            List<String> domains = Arrays.stream(domainsStr.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            org.setDomains(domains);
        }

        // Tags (boşlukla ayrılmış)
        String tagsStr = getValueFromRow(row, mappings, "tags");
        if (tagsStr != null) {
            List<String> tags = Arrays.stream(tagsStr.split(" "))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            org.setTags(tags);
        }

        return org;
    }

    private String getValueFromRow(Map<String, Object> row, Map<String, String> mappings, String grispiField) {
        String columnName = mappings.entrySet().stream()
                .filter(e -> e.getValue().equals(grispiField))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(null);

        if (columnName == null) return null;

        Object value = row.get(columnName);
        return value != null ? value.toString().trim() : null;
    }
}
