package com.example.demo.Repository;

import com.example.demo.Entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Organization findByExternalId(String externalId);
}
