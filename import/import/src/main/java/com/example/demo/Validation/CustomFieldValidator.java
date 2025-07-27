package com.example.demo.Validation;
import com.example.demo.Entity.CustomField;
import org.springframework.stereotype.Component;

@Component
public class CustomFieldValidator {

    public CustomFieldValidationResult validate(CustomField field) {
        CustomFieldValidationResult result = new CustomFieldValidationResult();

        if (field.getKey() == null || !(field.getKey().startsWith("ui") || field.getKey().startsWith("oi") || field.getKey().startsWith("ti"))) {
            result.addError("Key 'ui', 'oi' veya 'ti' ile başlamalı.");
        }

        if (field.getType() == null) {
            result.addError("Type boş olamaz.");
        }

        if (field.getPermission() == null) {
            result.addError("Permission boş olamaz.");
        }

        return result;
    }
}



