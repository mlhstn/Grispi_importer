package com.example.demo.Validation;
import com.example.demo.Entity.CustomField;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class CustomFieldValidator {

    public CustomFieldValidationResult validate(CustomField field) {
        CustomFieldValidationResult result = new CustomFieldValidationResult();

        // Tüm validasyonlar kaldırıldı - artık hiçbir alan zorunlu değil

        return result;
    }
}



