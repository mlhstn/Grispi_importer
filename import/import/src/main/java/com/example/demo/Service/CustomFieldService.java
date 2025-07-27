package com.example.demo.Service;

import com.example.demo.Entity.CustomField;
import com.example.demo.Repository.CustomFieldRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomFieldService {

    private final CustomFieldRepository customFieldRepository;

    public CustomFieldService(CustomFieldRepository customFieldRepository) {
        this.customFieldRepository = customFieldRepository;
    }

    public List<CustomField> getAllCustomFields() {
        return customFieldRepository.findAll();
    }

    public Optional<CustomField> getCustomFieldById(Long id) {
        return customFieldRepository.findById(id);
    }

    public CustomField saveCustomField(CustomField customField) {
        return customFieldRepository.save(customField);
    }

    public void deleteCustomField(Long id) {
        customFieldRepository.deleteById(id);
    }
    public CustomField save(CustomField field) {
        return customFieldRepository.save(field);
    }
}
