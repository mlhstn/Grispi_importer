package com.example.demo.Service;

import com.example.demo.Entity.Ticket;
import com.example.demo.Repository.TicketRepository;
import com.example.demo.Mapper.TicketMapper;
import com.example.demo.Validation.TicketValidator;
import com.example.demo.Validation.TicketValidationResult;
import com.example.demo.Service.ExcelService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class TicketService implements ImportService {

    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final TicketValidator ticketValidator;
    private final ObjectMapper objectMapper;

    public TicketService(TicketRepository ticketRepository, 
                        TicketMapper ticketMapper, 
                        TicketValidator ticketValidator,
                        ObjectMapper objectMapper) {
        this.ticketRepository = ticketRepository;
        this.ticketMapper = ticketMapper;
        this.ticketValidator = ticketValidator;
        this.objectMapper = objectMapper;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public Ticket saveTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    public void save(Ticket ticket) {
        ticketRepository.save(ticket);
    }

    @Override
    public Map<String, Object> importExcelWithMapping(MultipartFile file, String mappingsJson) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Mapping JSON'ını parse et
            List<Map<String, Object>> mappings = objectMapper.readValue(
                mappingsJson, 
                new TypeReference<List<Map<String, Object>>>() {}
            );
            
            // Mapping'i Map formatına çevir
            Map<String, String> columnMappings = new HashMap<>();
            for (Map<String, Object> mapping : mappings) {
                String excelColumn = (String) mapping.get("excelColumn");
                String grispiField = (String) mapping.get("grispiField");
                if (excelColumn != null && grispiField != null) {
                    columnMappings.put(excelColumn, grispiField);
                }
            }
            
            // Excel verilerini oku
            ExcelService excelService = new ExcelService();
            ExcelService.ExcelData excelData = excelService.readFullExcel(file);
            List<Map<String, Object>> transformedData = excelService.transformDataWithMapping(excelData, mappings);
            
            int successCount = 0;
            int errorCount = 0;
            List<String> errors = new ArrayList<>();
            
            for (Map<String, Object> row : transformedData) {
                try {
                    Ticket ticket = ticketMapper.mapWithMapping(row, columnMappings);
                    TicketValidationResult validationResult = ticketValidator.validate(ticket);
                    
                    if (validationResult.isValid()) {
                        saveTicket(ticket);
                        successCount++;
                    } else {
                        errorCount++;
                        errors.add("Row validation failed: " + validationResult.getErrors());
                    }
                } catch (Exception e) {
                    errorCount++;
                    errors.add("Row processing error: " + e.getMessage());
                }
            }
            
            result.put("success", true);
            result.put("totalRecords", transformedData.size());
            result.put("successCount", successCount);
            result.put("errorCount", errorCount);
            result.put("errors", errors);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Import error: " + e.getMessage());
        }
        
        return result;
    }
}
