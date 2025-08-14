package com.example.demo.Validation;

import com.example.demo.Entity.Group;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class GroupValidator {

    public GroupValidationResult validate(Group group) {
        GroupValidationResult result = new GroupValidationResult();

        // ExternalId otomatik oluşturulduğu için kontrol etmiyoruz
        // Sadece name zorunlu
        if (!StringUtils.hasText(group.getName())) {
            result.addError("Grup adı boş olamaz.");
        }

        return result;
    }
}
