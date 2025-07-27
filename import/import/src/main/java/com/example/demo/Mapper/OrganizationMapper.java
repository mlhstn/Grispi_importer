package com.example.demo.Mapper;

import com.example.demo.Entity.Group;
import com.example.demo.Entity.Organization;
import com.example.demo.Repository.GroupRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class OrganizationMapper {

    private final GroupRepository groupRepository;

    public OrganizationMapper(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public Organization mapToOrganization(Map<String, Object> row) {
        Organization org = new Organization();

        org.setExternalId((String) row.get("os.external_id"));
        org.setName((String) row.get("name"));
        org.setDescription((String) row.get("description"));
        org.setDetails((String) row.get("details"));
        org.setNotes((String) row.get("notes"));

        // Group adı varsa DB'den bul
        String groupNameStr = (String) row.get("group");
        if (groupNameStr != null && !groupNameStr.trim().isEmpty()) {
            Group group = groupRepository.findByName(groupNameStr.trim());
            org.setGroup(group);
        }

        // Domains
        String domainsStr = (String) row.get("domains");
        if (domainsStr != null && !domainsStr.trim().isEmpty()) {
            List<String> domains = Arrays.asList(domainsStr.split(","));
            org.setDomains(trimList(domains));
        } else {
            org.setDomains(new ArrayList<>());
        }

        // Tags
        String tagsStr = (String) row.get("tags");
        if (tagsStr != null && !tagsStr.trim().isEmpty()) {
            List<String> tags = Arrays.asList(tagsStr.split(" "));
            org.setTags(trimList(tags));
        } else {
            org.setTags(new ArrayList<>());
        }

        return org;
    }

    private List<String> trimList(List<String> list) {
        List<String> trimmed = new ArrayList<>();
        for (String item : list) {
            trimmed.add(item.trim());
        }
        return trimmed;
    }
}
