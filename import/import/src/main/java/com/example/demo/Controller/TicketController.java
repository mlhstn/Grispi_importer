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
public class TicketController {

    private final TicketMapper ticketMapper;
    private final TicketValidator ticketValidator;
    private final TicketService ticketService;

    public TicketController(TicketMapper ticketMapper, TicketValidator ticketValidator, TicketService ticketService) {
        this.ticketMapper = ticketMapper;
        this.ticketValidator = ticketValidator;
        this.ticketService = ticketService;
    }

    @PostMapping("/import")
    public ResponseEntity<TicketImportResponse> importMappedTickets(@RequestBody TicketImportRequest request) {
        List<Map<String, Object>> data = request.getData();
        Map<String, String> columnMappings = request.getColumnMappings();

        TicketImportResponse response = new TicketImportResponse();

        for (Map<String, Object> row : data) {
            Ticket ticket = ticketMapper.mapToTicket(row, columnMappings);
            TicketValidationResult validationResult = ticketValidator.validate(ticket);

            if (validationResult.isValid()) {
                ticketService.save(ticket);
                response.getSavedTickets().add(ticket.getExternalId());
            } else {
                validationResult.setTicketIdentifier(ticket.getExternalId());
                response.getFailedTickets().add(validationResult);
            }
        }

        return ResponseEntity.ok(response);
    }
}
