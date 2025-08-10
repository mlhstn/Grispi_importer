package com.example.demo.Service;

import com.example.demo.Entity.User;
import com.example.demo.Entity.enums.Language;
import com.example.demo.Entity.enums.Role;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Mapper.UserMapper;
import com.example.demo.Validation.UserValidator;
import com.example.demo.Validation.UserValidationResult;
import com.example.demo.Service.ExcelService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@Service
public class UserService implements ImportService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserValidator userValidator;
    private final ObjectMapper objectMapper;

    public UserService(UserRepository userRepository, 
                       UserMapper userMapper, 
                       UserValidator userValidator,
                       ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.userValidator = userValidator;
        this.objectMapper = objectMapper;
    }

    // Tüm kullanıcıları getir
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ID ile kullanıcı getir
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Yeni kullanıcı kaydet
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Kullanıcı sil
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Map<String, Object> importExcelWithMapping(MultipartFile file, String mappingsJson) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Mapping JSON'ını parse et
            List<Map<String, Object>> mappings = objectMapper.readValue(
                mappingsJson, 
                new TypeReference<List<Map<String, Object>>>() {}
            );
            
            // Excel verilerini oku
            ExcelService excelService = new ExcelService();
            ExcelService.ExcelData excelData = excelService.readFullExcel(file);
            List<Map<String, Object>> transformedData = excelService.transformDataWithMapping(excelData, mappings);
            
            int successCount = 0;
            int errorCount = 0;
            List<String> errors = new ArrayList<>();
            
            for (Map<String, Object> row : transformedData) {
                try {
                    User user = userMapper.mapWithMapping(row, new HashMap<>());
                    UserValidationResult validationResult = userValidator.validate(user);
                    
                    if (validationResult.isValid()) {
                        saveUser(user);
                        successCount++;
                    } else {
                        errorCount++;
                        errors.add("Row validation failed: " + validationResult.getErrors());
                    }
                } catch (Exception e) {
                    errorCount++;
                    errors.add("Row processing error: " + e.getMessage());
                }
            }
            
            result.put("success", true);
            result.put("totalRecords", transformedData.size());
            result.put("successCount", successCount);
            result.put("errorCount", errorCount);
            result.put("errors", errors);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Import error: " + e.getMessage());
        }
        
        return result;
    }

    // Excel verilerini User olarak import et
    public ImportResult importUsersFromExcel(List<Map<String, Object>> data) {
        ImportResult result = new ImportResult();
        result.setImportType("Users");
        result.setTotalRecords(data.size());
        result.setSuccessCount(0);
        result.setErrorCount(0);
        result.setErrors(new ArrayList<>());

        for (int i = 0; i < data.size(); i++) {
            Map<String, Object> row = data.get(i);
            try {
                User user = createUserFromMap(row);
                userRepository.save(user);
                result.setSuccessCount(result.getSuccessCount() + 1);
            } catch (Exception e) {
                result.setErrorCount(result.getErrorCount() + 1);
                result.getErrors().add("Satır " + (i + 1) + ": " + e.getMessage());
            }
        }

        return result;
    }

    // Map'ten User oluştur
    private User createUserFromMap(Map<String, Object> data) {
        User user = new User();
        
        System.out.println("Creating user from data: " + data);
        
        // Temel alanları set et - farklı alan adları için kontrol
        if (data.containsKey("externalId")) {
            user.setExternalId((String) data.get("externalId"));
        } else if (data.containsKey("External ID")) {
            user.setExternalId((String) data.get("External ID"));
        }
        
        if (data.containsKey("firstName")) {
            user.setFirstName((String) data.get("firstName"));
        } else if (data.containsKey("Ad") || data.containsKey("First Name")) {
            String firstName = data.get("Ad") != null ? (String) data.get("Ad") : (String) data.get("First Name");
            user.setFirstName(firstName);
        }
        
        if (data.containsKey("lastName")) {
            user.setLastName((String) data.get("lastName"));
        } else if (data.containsKey("Soyad") || data.containsKey("Last Name")) {
            String lastName = data.get("Soyad") != null ? (String) data.get("Soyad") : (String) data.get("Last Name");
            user.setLastName(lastName);
        }
        
        if (data.containsKey("phone")) {
            user.setPhone((String) data.get("phone"));
        } else if (data.containsKey("Telefon") || data.containsKey("Phone")) {
            String phone = data.get("Telefon") != null ? (String) data.get("Telefon") : (String) data.get("Phone");
            user.setPhone(phone);
        }
        
        // Email listesi
        if (data.containsKey("emails")) {
            String emailsStr = (String) data.get("emails");
            if (emailsStr != null && !emailsStr.trim().isEmpty()) {
                List<String> emails = Arrays.asList(emailsStr.split(","));
                user.setEmails(emails);
            }
        } else if (data.containsKey("E-posta") || data.containsKey("Email")) {
            String emailStr = (String) (data.get("E-posta") != null ? data.get("E-posta") : data.get("Email"));
            if (emailStr != null && !emailStr.trim().isEmpty()) {
                user.setEmails(Arrays.asList(emailStr));
            }
        }
        
        // Telefon listesi
        if (data.containsKey("phones")) {
            String phonesStr = (String) data.get("phones");
            if (phonesStr != null && !phonesStr.trim().isEmpty()) {
                List<String> phones = Arrays.asList(phonesStr.split(","));
                user.setPhones(phones);
            }
        }
        
        // Dil
        if (data.containsKey("language")) {
            String languageStr = (String) data.get("language");
            if (languageStr != null && !languageStr.trim().isEmpty()) {
                try {
                    Language language = Language.valueOf(languageStr.toUpperCase());
                    user.setLanguage(language);
                } catch (IllegalArgumentException e) {
                    // Varsayılan dil
                    user.setLanguage(Language.TR);
                }
            }
        } else if (data.containsKey("Dil")) {
            String languageStr = (String) data.get("Dil");
            if (languageStr != null && !languageStr.trim().isEmpty()) {
                try {
                    Language language = Language.valueOf(languageStr.toUpperCase());
                    user.setLanguage(language);
                } catch (IllegalArgumentException e) {
                    user.setLanguage(Language.TR);
                }
            }
        }
        
        // Rol
        if (data.containsKey("role")) {
            String roleStr = (String) data.get("role");
            if (roleStr != null && !roleStr.trim().isEmpty()) {
                try {
                    Role role = Role.valueOf(roleStr.toUpperCase());
                    user.setRole(role);
                } catch (IllegalArgumentException e) {
                    // Varsayılan rol
                    user.setRole(Role.CUSTOMER);
                }
            }
        } else if (data.containsKey("Rol")) {
            String roleStr = (String) data.get("Rol");
            if (roleStr != null && !roleStr.trim().isEmpty()) {
                try {
                    Role role = Role.valueOf(roleStr.toUpperCase());
                    user.setRole(role);
                } catch (IllegalArgumentException e) {
                    user.setRole(Role.CUSTOMER);
                }
            }
        }
        
        // Etiketler
        if (data.containsKey("tags")) {
            String tagsStr = (String) data.get("tags");
            if (tagsStr != null && !tagsStr.trim().isEmpty()) {
                List<String> tags = Arrays.asList(tagsStr.split(","));
                user.setTags(tags);
            }
        } else if (data.containsKey("Etiketler")) {
            String tagsStr = (String) data.get("Etiketler");
            if (tagsStr != null && !tagsStr.trim().isEmpty()) {
                List<String> tags = Arrays.asList(tagsStr.split(","));
                user.setTags(tags);
            }
        }
        
        // Aktif durumu
        if (data.containsKey("enabled")) {
            String enabledStr = (String) data.get("enabled");
            if (enabledStr != null) {
                user.setEnabled(Boolean.parseBoolean(enabledStr));
            } else {
                user.setEnabled(true); // Varsayılan olarak aktif
            }
        } else if (data.containsKey("Aktif")) {
            String enabledStr = (String) data.get("Aktif");
            if (enabledStr != null) {
                user.setEnabled(Boolean.parseBoolean(enabledStr));
            } else {
                user.setEnabled(true);
            }
        } else {
            user.setEnabled(true);
        }
        
        System.out.println("Created user: " + user);
        return user;
    }

    // ImportResult sınıfı
    public static class ImportResult {
        private String importType;
        private int totalRecords;
        private int successCount;
        private int errorCount;
        private List<String> errors;
        
        // Getters and Setters
        public String getImportType() { return importType; }
        public void setImportType(String importType) { this.importType = importType; }
        
        public int getTotalRecords() { return totalRecords; }
        public void setTotalRecords(int totalRecords) { this.totalRecords = totalRecords; }
        
        public int getSuccessCount() { return successCount; }
        public void setSuccessCount(int successCount) { this.successCount = successCount; }
        
        public int getErrorCount() { return errorCount; }
        public void setErrorCount(int errorCount) { this.errorCount = errorCount; }
        
        public List<String> getErrors() { return errors; }
        public void setErrors(List<String> errors) { this.errors = errors; }
    }
}
