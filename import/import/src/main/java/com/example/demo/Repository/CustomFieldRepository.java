package com.example.demo.Repository;

import com.example.demo.Entity.CustomField;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomFieldRepository extends JpaRepository<CustomField, Long> {

    boolean existsByKey(String key);

}
