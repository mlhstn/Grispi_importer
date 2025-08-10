package com.example.demo.Mapper;

import com.example.demo.Entity.*;
import com.example.demo.Entity.enums.Channel;
import com.example.demo.Entity.enums.TicketPriority;
import com.example.demo.Entity.enums.TicketStatus;
import com.example.demo.Entity.enums.TicketType;
import com.example.demo.Repository.GroupRepository;
import com.example.demo.Repository.OrganizationRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class TicketMapper {

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final OrganizationRepository organizationRepository;

    public TicketMapper(UserRepository userRepository,
                        GroupRepository groupRepository,
                        OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.organizationRepository = organizationRepository;
    }

    public Ticket mapToTicket(Map<String, Object> row, Map<String, String> mappings) {
        Ticket ticket = new Ticket();

        // ExcelService zaten grispiField adını key olarak kullanıyor
        for (String grispiField : Arrays.asList("externalId", "subject", "description", "status", "priority", "type", "channel", "form", "createdAt", "updatedAt", "solvedAt", "creator", "requester", "assignee", "assigneeGroup", "organization", "tags")) {
            Object rawValue = row.get(grispiField);

            if (rawValue == null || rawValue.toString().trim().isEmpty()) continue;

            String value = rawValue.toString().trim();

            switch (grispiField) {
                case "externalId":
                    ticket.setExternalId(value);
                    break;
                case "subject":
                    ticket.setSubject(value);
                    break;
                case "description":
                    ticket.setDescription(value);
                    break;
                case "status":
                    try {
                        ticket.setStatus(TicketStatus.valueOf(value.toUpperCase()));
                    } catch (IllegalArgumentException ignored) {}
                    break;
                case "priority":
                    try {
                        ticket.setPriority(TicketPriority.valueOf(value.toUpperCase()));
                    } catch (IllegalArgumentException ignored) {}
                    break;
                case "type":
                    try {
                        ticket.setType(TicketType.valueOf(value.toUpperCase()));
                    } catch (IllegalArgumentException ignored) {}
                    break;
                case "channel":
                    try {
                        ticket.setChannel(Channel.valueOf(value.toUpperCase()));
                    } catch (IllegalArgumentException ignored) {}
                    break;
                case "form":
                    ticket.setForm(value);
                    break;
                case "createdAt":
                    try {
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                        ticket.setCreatedAt(LocalDateTime.parse(value, formatter));
                    } catch (Exception ignored) {}
                    break;
                case "updatedAt":
                    try {
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                        ticket.setUpdatedAt(LocalDateTime.parse(value, formatter));
                    } catch (Exception ignored) {}
                    break;
                case "solvedAt":
                    try {
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                        ticket.setSolvedAt(LocalDateTime.parse(value, formatter));
                    } catch (Exception ignored) {}
                    break;
                case "creator":
                    User creator = userRepository.findByExternalId(value).orElse(null);
                    ticket.setCreator(creator);
                    break;
                case "requester":
                    User requester = userRepository.findByExternalId(value).orElse(null);
                    ticket.setRequester(requester);
                    break;
                case "assignee":
                    User assignee = userRepository.findByExternalId(value).orElse(null);
                    ticket.setAssignee(assignee);
                    break;
                case "assigneeGroup":
                    Group group = groupRepository.findByName(value);
                    ticket.setAssigneeGroup(group);
                    break;
                case "organization":
                    Organization org = organizationRepository.findByExternalId(value);
                    ticket.setOrganization(org);
                    break;
                case "tags":
                    List<String> tags = Arrays.asList(value.split("\\s+"));
                    ticket.setTags(tags);
                    break;
                default:
                    // bilinmeyen alanlar
                    break;
            }
        }

        return ticket;
    }

    public Ticket mapWithMapping(Map<String, Object> row, Map<String, String> mappings) {
        return mapToTicket(row, mappings);
    }
}
