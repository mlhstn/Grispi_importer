package com.example.demo.Repository;

import com.example.demo.Entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {

    Group findByName(String name);
}
