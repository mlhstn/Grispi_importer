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
import java.util.HashMap;

@Component
public class UserMapper {

    private final GroupRepository groupRepository;
    private final OrganizationRepository organizationRepository;

    public UserMapper(GroupRepository groupRepository, OrganizationRepository organizationRepository) {
        this.groupRepository = groupRepository;
        this.organizationRepository = organizationRepository;
    }

    public User mapWithMapping(Map<String, Object> row, List<Map<String, Object>> mappings) {
        User user = new User();

        // Mapping'den grispi field adlarını al
        Map<String, String> fieldMapping = new HashMap<>();
        for (Map<String, Object> mapping : mappings) {
            String excelColumn = (String) mapping.get("excelColumn");
            String grispiField = (String) mapping.get("grispiField");
            if (excelColumn != null && grispiField != null) {
                fieldMapping.put(grispiField, excelColumn);
            }
        }

        // ExternalId - boşsa null bırak
        String externalId = getString(row, "externalId");
        user.setExternalId(externalId);
        
        user.setFirstName(getString(row, "firstName"));
        user.setLastName(getString(row, "lastName"));
        
        // Telefon numarasını parse et
        String phoneStr = getString(row, "phone");
        if (phoneStr != null && !phoneStr.trim().isEmpty()) {
            // Bilimsel notasyon formatını kontrol et (örn: 5.952159955E9)
            if (phoneStr.contains("E") || phoneStr.contains("e")) {
                try {
                    double phoneNumber = Double.parseDouble(phoneStr);
                    // Sayıyı long'a çevir ve string'e dönüştür
                    long phoneLong = (long) phoneNumber;
                    phoneStr = String.valueOf(phoneLong);
                } catch (NumberFormatException e) {
                    // Parse edilemezse orijinal değeri kullan
                }
            }
            user.setPhone(phoneStr);
        }

        // Emails (virgül ile ayrılmış)
        String emailsStr = getString(row, "emails");
        if (emailsStr != null && !emailsStr.isBlank()) {
            List<String> emails = Arrays.asList(emailsStr.split(","));
            user.setEmails(trimList(emails));
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
        if (orgExternalId != null && !orgExternalId.trim().isEmpty()) {
            Organization org = organizationRepository.findByExternalId(orgExternalId);
            if (org == null) {
                // Organization bulunamadıysa otomatik oluştur
                org = new Organization();
                org.setExternalId(orgExternalId);
                org.setName(orgExternalId);
                org = organizationRepository.save(org);
            }
            user.setOrganization(org);
        }

        // Groups (boşluk ile ayrılmış isimler)
        String groupsStr = getString(row, "groups");
        if (groupsStr != null && !groupsStr.trim().isEmpty()) {
            List<String> groupNames = Arrays.asList(groupsStr.split(" "));
            List<Group> groups = new ArrayList<>();
            for (String name : groupNames) {
                String trimmedName = name.trim();
                if (!trimmedName.isEmpty()) {
                    Group group = groupRepository.findByName(trimmedName);
                    if (group == null) {
                        // Group bulunamadıysa otomatik oluştur
                        group = new Group();
                        group.setName(trimmedName);
                        group = groupRepository.save(group);
                    }
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
