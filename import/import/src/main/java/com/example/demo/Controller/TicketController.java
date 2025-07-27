package com.example.demo.Controller;

import com.example.demo.DTO.TicketImportResponse;
import com.example.demo.Entity.Ticket;
import com.example.demo.Service.TicketService;
import com.example.demo.Validation.TicketValidationResult;
import com.example.demo.Validation.TicketValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final TicketValidator ticketValidator;

    public TicketController(TicketService ticketService, TicketValidator ticketValidator) {
        this.ticketService = ticketService;
        this.ticketValidator = ticketValidator;
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
}
