package com.example.demo.Mapper;

import com.example.demo.Entity.Group;
import com.example.demo.Entity.Organization;
import com.example.demo.Entity.User;
import com.example.demo.Entity.enums.Language;
import com.example.demo.Entity.enums.Role;
import com.example.demo.Repository.GroupRepository;
import com.example.demo.Repository.OrganizationRepository;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class UserMapper {

    private final GroupRepository groupRepository;
    private final OrganizationRepository organizationRepository;

    public UserMapper(GroupRepository groupRepository, OrganizationRepository organizationRepository) {
        this.groupRepository = groupRepository;
        this.organizationRepository = organizationRepository;
    }

    public User mapWithMapping(Map<String, Object> row, Map<String, String> mapping) {
        User user = new User();

        user.setExternalId(getString(row, mapping.get("externalId")));
        user.setFirstName(getString(row, mapping.get("firstName")));
        user.setLastName(getString(row, mapping.get("lastName")));
        user.setPhone(getString(row, mapping.get("phone")));

        // Emails (virgül ile ayrılmış)
        String emailsStr = getString(row, mapping.get("emails"));
        if (emailsStr != null && !emailsStr.isBlank()) {
            List<String> emails = Arrays.asList(emailsStr.split(","));
            user.setEmails(trimList(emails));
        }

        // Phones (virgül ile ayrılmış)
        String phonesStr = getString(row, mapping.get("phones"));
        if (phonesStr != null && !phonesStr.isBlank()) {
            List<String> phones = Arrays.asList(phonesStr.split(","));
            user.setPhones(trimList(phones));
        }

        // Tags (boşluk ile ayrılmış)
        String tagsStr = getString(row, mapping.get("tags"));
        if (tagsStr != null && !tagsStr.isBlank()) {
            List<String> tags = Arrays.asList(tagsStr.split(" "));
            user.setTags(trimList(tags));
        }

        // Role enum
        String roleStr = getString(row, mapping.get("role"));
        if (roleStr != null) {
            try {
                user.setRole(Role.valueOf(roleStr.toUpperCase()));
            } catch (Exception e) {
                user.setRole(null); // geçersizse boş bırak
            }
        }

        // Language enum
        String langStr = getString(row, mapping.get("language"));
        if (langStr != null) {
            try {
                user.setLanguage(Language.valueOf(langStr.toUpperCase()));
            } catch (Exception e) {
                user.setLanguage(null);
            }
        }

        // Organization
        String orgExternalId = getString(row, mapping.get("organization"));
        if (orgExternalId != null) {
            Organization org = organizationRepository.findByExternalId(orgExternalId);
            user.setOrganization(org);
        }

        // Groups (boşluk ile ayrılmış isimler)
        String groupsStr = getString(row, mapping.get("groups"));
        if (groupsStr != null) {
            List<String> groupNames = Arrays.asList(groupsStr.split(" "));
            List<Group> groups = new ArrayList<>();
            for (String name : groupNames) {
                Group group = groupRepository.findByName(name.trim());
                if (group != null) {
                    groups.add(group);
                }
            }
            user.setGroups(groups);
        }

        // Enabled
        String enabledStr = getString(row, mapping.get("enabled"));
        if (enabledStr != null) {
            user.setEnabled(Boolean.parseBoolean(enabledStr));
        }

        return user;
    }

    private String getString(Map<String, Object> row, String key) {
        if (key == null || !row.containsKey(key)) return null;
        Object value = row.get(key);
        return value != null ? value.toString().trim() : null;
    }

    private List<String> trimList(List<String> list) {
        List<String> trimmed = new ArrayList<>();
        for (String item : list) {
            trimmed.add(item.trim());
        }
        return trimmed;
    }
}
