package com.example.demo.Repository;

import com.example.demo.Entity.MappingTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MappingTemplateRepository extends JpaRepository<MappingTemplate, Long> {
    
    // Import türüne göre aktif şablonları getir
    List<MappingTemplate> findByImportTypeAndIsActiveTrueOrderByNameAsc(String importType);
    
    // Import türüne göre varsayılan şablonu getir
    Optional<MappingTemplate> findByImportTypeAndIsDefaultTrueAndIsActiveTrue(String importType);
    
    // İsme göre şablon ara
    List<MappingTemplate> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    // Import türüne göre tüm şablonları getir (aktif olmayanlar dahil)
    List<MappingTemplate> findByImportTypeOrderByNameAsc(String importType);
    
    // Import türüne göre tüm şablonları getir (basit method)
    List<MappingTemplate> findByImportType(String importType);
    
    // Belirli bir import türü için şablon sayısını getir
    @Query("SELECT COUNT(t) FROM MappingTemplate t WHERE t.importType = :importType AND t.isActive = true")
    long countByImportTypeAndActive(@Param("importType") String importType);
    
    // Varsayılan şablonları getir
    List<MappingTemplate> findByIsDefaultTrueAndIsActiveTrue();
    
    // Aktif şablonları getir
    List<MappingTemplate> findByIsActiveTrue();
}
