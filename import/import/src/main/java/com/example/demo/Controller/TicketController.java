package com.example.demo.Controller;

import com.example.demo.DTO.TicketImportRequest;
import com.example.demo.DTO.TicketImportResponse;
import com.example.demo.Entity.Ticket;
import com.example.demo.Mapper.TicketMapper;
import com.example.demo.Service.TicketService;
import com.example.demo.Validation.TicketValidationResult;
import com.example.demo.Validation.TicketValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {

    private final TicketValidator ticketValidator;
    private final TicketService ticketService;
    private final TicketMapper ticketMapper;

    public TicketController(TicketValidator ticketValidator, TicketService ticketService, TicketMapper ticketMapper) {
        this.ticketValidator = ticketValidator;
        this.ticketService = ticketService;
        this.ticketMapper = ticketMapper;
    }

    @PostMapping("/validate")
    public ResponseEntity<TicketValidationResult> validateTicket(@RequestBody Ticket ticket) {
        TicketValidationResult result = ticketValidator.validate(ticket);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/import")
    public ResponseEntity<TicketImportResponse> importTickets(@RequestBody List<Ticket> tickets) {
        TicketImportResponse response = new TicketImportResponse();

        for (Ticket ticket : tickets) {
            TicketValidationResult validationResult = ticketValidator.validate(ticket);

            if (validationResult.isValid()) {
                ticketService.saveTicket(ticket);
                response.getSavedTickets().add(ticket.getExternalId());
            } else {
                validationResult.setTicketIdentifier(ticket.getExternalId());
                response.getFailedTickets().add(validationResult);
            }
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/import-mapped")
    public ResponseEntity<TicketImportResponse> importMappedTickets(@RequestBody TicketImportRequest request) {
        TicketImportResponse response = new TicketImportResponse();

        for (Map<String, Object> row : request.getData()) {
            Ticket ticket = ticketMapper.mapWithMapping(row, request.getColumnMappings());
            TicketValidationResult validationResult = ticketValidator.validate(ticket);

            if (validationResult.isValid()) {
                ticketService.saveTicket(ticket);
                response.getSavedTickets().add(ticket.getExternalId());
            } else {
                validationResult.setTicketIdentifier(ticket.getExternalId());
                response.getFailedTickets().add(validationResult);
            }
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/import-mapping")
    public ResponseEntity<Map<String, Object>> importWithMapping(@RequestBody Map<String, Object> request) {
        try {
            String importType = (String) request.get("importType");
            List<Map<String, Object>> mappings = (List<Map<String, Object>>) request.get("mappings");
            Integer totalRows = (Integer) request.get("totalRows");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Ticket mapping verileri alındı",
                "importType", importType,
                "mappedFields", mappings.size(),
                "totalRows", totalRows
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
