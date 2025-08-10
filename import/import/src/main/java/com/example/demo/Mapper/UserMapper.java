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
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class UserMapper {

    private final GroupRepository groupRepository;
    private final OrganizationRepository organizationRepository;
    private final AtomicInteger userCounter = new AtomicInteger(1);

    public UserMapper(GroupRepository groupRepository, OrganizationRepository organizationRepository) {
        this.groupRepository = groupRepository;
        this.organizationRepository = organizationRepository;
    }

    public User mapWithMapping(Map<String, Object> row, Map<String, String> mapping) {
        User user = new User();

        // ExternalId otomatik oluştur
        String externalId = getString(row, "externalId");
        if (externalId == null || externalId.trim().isEmpty()) {
            externalId = "USR" + String.format("%03d", userCounter.getAndIncrement());
        }
        user.setExternalId(externalId);
        
        user.setFirstName(getString(row, "firstName"));
        user.setLastName(getString(row, "lastName"));
        user.setPhone(getString(row, "phone"));

        // Emails (virgül ile ayrılmış)
        String emailsStr = getString(row, "emails");
        if (emailsStr != null && !emailsStr.isBlank()) {
            List<String> emails = Arrays.asList(emailsStr.split(","));
            user.setEmails(trimList(emails));
        }

        // Phones (virgül ile ayrılmış)
        String phonesStr = getString(row, "phones");
        if (phonesStr != null && !phonesStr.isBlank()) {
            List<String> phones = Arrays.asList(phonesStr.split(","));
            user.setPhones(trimList(phones));
        }

        // Tags (boşluk ile ayrılmış)
        String tagsStr = getString(row, "tags");
        if (tagsStr != null && !tagsStr.isBlank()) {
            List<String> tags = Arrays.asList(tagsStr.split(" "));
            user.setTags(trimList(tags));
        }

        // Role enum
        String roleStr = getString(row, "role");
        if (roleStr != null) {
            try {
                user.setRole(Role.valueOf(roleStr.toUpperCase()));
            } catch (Exception e) {
                user.setRole(Role.CUSTOMER); // varsayılan rol
            }
        } else {
            user.setRole(Role.CUSTOMER); // varsayılan rol
        }

        // Language enum
        String langStr = getString(row, "language");
        if (langStr != null) {
            try {
                user.setLanguage(Language.valueOf(langStr.toUpperCase()));
            } catch (Exception e) {
                user.setLanguage(Language.TR); // varsayılan dil
            }
        } else {
            user.setLanguage(Language.TR); // varsayılan dil
        }

        // Organization
        String orgExternalId = getString(row, "organization");
        if (orgExternalId != null) {
            Organization org = organizationRepository.findByExternalId(orgExternalId);
            user.setOrganization(org);
        }

        // Groups (boşluk ile ayrılmış isimler)
        String groupsStr = getString(row, "groups");
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
        String enabledStr = getString(row, "enabled");
        if (enabledStr != null) {
            user.setEnabled(Boolean.parseBoolean(enabledStr));
        } else {
            user.setEnabled(true); // varsayılan olarak aktif
        }

        return user;
    }

    private String getString(Map<String, Object> row, String key) {
        // ExcelService zaten grispiField adını key olarak kullanıyor
        if (key == null) return null;
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
