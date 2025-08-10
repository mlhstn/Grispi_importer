package com.example.demo.Validation;
import com.example.demo.Entity.CustomField;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class CustomFieldValidator {

    public CustomFieldValidationResult validate(CustomField field) {
        CustomFieldValidationResult result = new CustomFieldValidationResult();

        // Key kontrolü - Excel'de "field_1" formatında geliyor
        if (!StringUtils.hasText(field.getKey())) {
            result.addError("Key boş olamaz.");
        }

        // Type kontrolü - Excel'de "Text", "Number" formatında geliyor
        if (field.getType() == null) {
            result.addError("Type boş olamaz.");
        }

        // Name kontrolü
        if (!StringUtils.hasText(field.getName())) {
            result.addError("Name boş olamaz.");
        }

        // Permission kontrolü - Excel'de "Read-Write" formatında geliyor
        if (field.getPermission() == null) {
            result.addError("Permission boş olamaz.");
        }

        return result;
    }
}



