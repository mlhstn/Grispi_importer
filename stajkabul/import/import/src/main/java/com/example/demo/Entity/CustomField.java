package com.example.demo.Entity;

import com.example.demo.Entity.enums.CustomFieldType;
import com.example.demo.Entity.enums.PermissionLevel;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "custom_fields")
public class CustomField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String key;

    // type enum olarak düzenlendi
    @Enumerated(EnumType.STRING)
    private CustomFieldType type;

    private String name;
    private String description;

    // permission enum olarak düzenlendi
    @Enumerated(EnumType.STRING)
    private PermissionLevel permission;

    private boolean required;

    private String descriptionForAgents;
    private String descriptionForCustomers;
    private String titleForAgents;
    private String titleForCustomers;
    private boolean enabled;

    @ElementCollection
    @CollectionTable(name = "custom_field_options", joinColumns = @JoinColumn(name = "custom_field_id"))
    @Column(name = "option_value")
    private List<String> options;

    @ManyToMany
    @JoinTable(
            name = "custom_field_groups",
            joinColumns = @JoinColumn(name = "custom_field_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    private List<Group> groups;

    public CustomField() {

    }

    public CustomField(Long id, String key,
                       CustomFieldType type,
                       String name, String description,
                       PermissionLevel permission, boolean required,
                       String descriptionForAgents, String descriptionForCustomers,
                       String titleForAgents,
                       String titleForCustomers,
                       boolean enabled,
                       List<String> options,
                       List<Group> groups) {

        this.id = id;
        this.key = key;
        this.type = type;
        this.name = name;
        this.description = description;
        this.permission = permission;
        this.required = required;
        this.descriptionForAgents = descriptionForAgents;
        this.descriptionForCustomers = descriptionForCustomers;
        this.titleForAgents = titleForAgents;
        this.titleForCustomers = titleForCustomers;
        this.enabled = enabled;
        this.options = options;
        this.groups = groups;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public CustomFieldType getType() {
        return type;
    }

    public void setType(CustomFieldType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public PermissionLevel getPermission() {
        return permission;
    }

    public void setPermission(PermissionLevel permission) {
        this.permission = permission;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public String getDescriptionForAgents() {
        return descriptionForAgents;
    }

    public void setDescriptionForAgents(String descriptionForAgents) {
        this.descriptionForAgents = descriptionForAgents;
    }

    public String getDescriptionForCustomers() {
        return descriptionForCustomers;
    }

    public void setDescriptionForCustomers(String descriptionForCustomers) {
        this.descriptionForCustomers = descriptionForCustomers;
    }

    public String getTitleForAgents() {
        return titleForAgents;
    }

    public void setTitleForAgents(String titleForAgents) {
        this.titleForAgents = titleForAgents;
    }

    public String getTitleForCustomers() {
        return titleForCustomers;
    }

    public void setTitleForCustomers(String titleForCustomers) {
        this.titleForCustomers = titleForCustomers;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public List<Group> getGroups() {
        return groups;
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
    }
}
