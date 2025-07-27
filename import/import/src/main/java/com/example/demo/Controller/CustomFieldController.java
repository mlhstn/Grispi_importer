package com.example.demo.Controller;

import com.example.demo.DTO.CustomFieldImportResponse;
import com.example.demo.Entity.CustomField;
import com.example.demo.Mapper.CustomFieldMapper;
import com.example.demo.Service.CustomFieldService;
import com.example.demo.Validation.CustomFieldValidationResult;
import com.example.demo.Validation.CustomFieldValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/custom-fields")
public class CustomFieldController {

    private final CustomFieldMapper mapper;
    private final CustomFieldValidator validator;
    private final CustomFieldService service;

    public CustomFieldController(CustomFieldMapper mapper,
                                 CustomFieldValidator validator,
                                 CustomFieldService service) {
        this.mapper = mapper;
        this.validator = validator;
        this.service = service;
    }

    @PostMapping("/import")
    public ResponseEntity<CustomFieldImportResponse> importCustomFields(@RequestBody List<Map<String, Object>> data) {
        CustomFieldImportResponse response = new CustomFieldImportResponse();

        for (Map<String, Object> row : data) {
            CustomField field = mapper.mapToCustomField(row);
            CustomFieldValidationResult result = validator.validate(field);

            if (result.isValid()) {
                service.save(field);
                response.getSavedCustomFields().add(field.getKey());
            } else {
                result.setCustomFieldKey(field.getKey());
                response.getFailedCustomFields().add(result);
            }
        }

        return ResponseEntity.ok(response);
    }
}
