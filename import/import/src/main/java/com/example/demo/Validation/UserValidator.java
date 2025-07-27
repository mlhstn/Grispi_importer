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

        if (isBlank(user.getExternalId())) {
            result.addError("externalId boş olamaz.");
        }

        if (isBlank(user.getFirstName())) {
            result.addError("First name boş olamaz.");
        }

        if (isBlank(user.getLastName())) {
            result.addError("Last name boş olamaz.");
        }

        if (user.getEmails() != null) {
            for (String email : user.getEmails()) {
                if (!EMAIL_REGEX.matcher(email).matches()) {
                    result.addError("Geçersiz email: " + email);
                }
            }
        }

        if (!isBlank(user.getPhone()) && !PHONE_E164_REGEX.matcher(user.getPhone()).matches()) {
            result.addError("Telefon E.164 formatında değil.");
        }

        if (user.getRole() == null) {
            result.addError("Role boş olamaz. Beklenen: ADMIN, AGENT, CUSTOMER");
        }

        return result;
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }
}
