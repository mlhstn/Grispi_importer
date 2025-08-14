package com.example.demo.Validation;

import com.example.demo.Entity.Ticket;
import com.example.demo.Entity.enums.TicketPriority;
import com.example.demo.Entity.enums.TicketStatus;
import com.example.demo.Entity.enums.TicketType;
import com.example.demo.Entity.enums.Channel;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class TicketValidator {

    public TicketValidationResult validate(Ticket ticket) {
        TicketValidationResult result = new TicketValidationResult();

        if (!StringUtils.hasText(ticket.getExternalId())) {
            result.addError("External ID boş olamaz.");
        }

        // Subject zorunlu değil, sadece varsa kontrol et
        if (StringUtils.hasText(ticket.getSubject()) && ticket.getSubject().length() < 3) {
            result.addError("Subject en az 3 karakter olmalıdır.");
        }

        return result;
    }
}
