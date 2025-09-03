package com.example.demo.Validation;

import com.example.demo.Entity.User;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class UserValidator {

    private static final Pattern EMAIL_REGEX =
            Pattern.compile("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

    private static final Pattern PHONE_E164_REGEX =
            Pattern.compile("^\\+\\d{10,15}$");

    public UserValidationResult validate(User user) {
        UserValidationResult result = new UserValidationResult();

        // En az bir tanımlayıcı alan gerekli (externalId, email veya telefon)
        boolean hasIdentifier = !isBlank(user.getExternalId()) || 
                               (user.getEmails() != null && !user.getEmails().isEmpty()) ||
                               !isBlank(user.getPhone());
        
        // Debug için detaylı log ekle
        System.out.println("Validation debug - externalId: " + user.getExternalId() + 
                          ", emails: " + user.getEmails() + 
                          ", phone: " + user.getPhone() + 
                          ", hasIdentifier: " + hasIdentifier);
        System.out.println("Email list size: " + (user.getEmails() != null ? user.getEmails().size() : "null"));
        if (user.getEmails() != null && !user.getEmails().isEmpty()) {
            System.out.println("First email: " + user.getEmails().get(0));
        }
        
        if (!hasIdentifier) {
            result.addError("At least one identifier field is required: externalId, email or phone.");
        }

        if (isBlank(user.getFirstName())) {
            result.addError("First name cannot be empty.");
        }

        if (isBlank(user.getLastName())) {
            result.addError("Last name cannot be empty.");
        }

        if (user.getEmails() != null) {
            for (String email : user.getEmails()) {
                if (!EMAIL_REGEX.matcher(email).matches()) {
                    result.addError("Invalid email: " + email);
                }
            }
        }

        if (!isBlank(user.getPhone())) {
            String phone = user.getPhone();
            // Eğer + ile başlamıyorsa ve 10 haneli ise +90 ekle
            if (!phone.startsWith("+") && phone.length() == 10 && phone.matches("\\d{10}")) {
                phone = "+90" + phone;
                user.setPhone(phone);
            }
            
            if (!PHONE_E164_REGEX.matcher(phone).matches()) {
                result.addError("Phone is not in E.164 format: " + phone);
            }
        }

        if (user.getRole() == null) {
            result.addError("Role cannot be empty. Expected: ADMIN, AGENT, CUSTOMER");
        }

        return result;
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }
}
