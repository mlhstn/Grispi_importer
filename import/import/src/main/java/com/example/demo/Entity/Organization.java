package com.example.demo.Entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String externalId; // os.external_id
    private String name;
    private String description;
    private String details;
    private String notes;

    // Group ile ManyToOne ilişki (bir organization bir gruba ait olabilir)
    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    // Eğer domains virgülle ayrılan listeyse, şu şekilde tutulabilir:
    @ElementCollection
    @CollectionTable(name = "organization_domains", joinColumns = @JoinColumn(name = "organization_id"))
    @Column(name = "domain")
    private List<String> domains;

    // Tags da benzer şekilde listelenebilir
    @ElementCollection
    @CollectionTable(name = "organization_tags", joinColumns = @JoinColumn(name = "organization_id"))
    @Column(name = "tag")
    private List<String> tags;

    public Organization() {

    }

    public Organization(Long id, String externalId, String name,
                        String description, String details,
                        String notes, Group group,
                        List<String> domains, List<String> tags) {
        this.id = id;
        this.externalId = externalId;
        this.name = name;
        this.description = description;
        this.details = details;
        this.notes = notes;
        this.group = group;
        this.domains = domains;
        this.tags = tags;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
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

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public List<String> getDomains() {
        return domains;
    }

    public void setDomains(List<String> domains) {
        this.domains = domains;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
