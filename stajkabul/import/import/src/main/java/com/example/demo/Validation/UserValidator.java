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

        // Sadece 4 alan kontrolü: firstName, email, externalId, telephone
        boolean hasRequiredField = !isBlank(user.getFirstName()) || 
                                  !isBlank(user.getExternalId()) ||
                                  (user.getEmails() != null && !user.getEmails().isEmpty()) ||
                                  !isBlank(user.getPhone());
        
        if (!hasRequiredField) {
            result.addError("At least one of these fields is required: firstName, externalId, email, or phone.");
        }

        // Email format kontrolü (varsa)
        if (user.getEmails() != null) {
            for (String email : user.getEmails()) {
                if (!EMAIL_REGEX.matcher(email).matches()) {
                    result.addError("Invalid email: " + email);
                }
            }
        }

        // Telefon format kontrolü (varsa)
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

        return result;
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }
}
