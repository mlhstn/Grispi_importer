package com.example.demo.Service;

import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;

@Service
public class ExcelService {

    @Autowired
    private UserService userService;
    
    @Autowired
    private OrganizationService organizationService;
    
    @Autowired
    private com.example.demo.Mapper.OrganizationMapper organizationMapper;

    // Her sheet için ilk N satırı oku ve JSON benzeri yapı oluştur (List<Map<colName, value>>)
    public Map<String, List<Map<String, String>>> readExcelPreview(MultipartFile file, int previewRowCount) throws Exception {
        Map<String, List<Map<String, String>>> sheetData = new LinkedHashMap<>();

        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {

            for (Sheet sheet : workbook) {
                List<Map<String, String>> rows = new ArrayList<>();

                // İlk satır başlık olarak kabul edelim
                Row headerRow = sheet.getRow(0);
                if (headerRow == null) continue;

                int maxCellNum = headerRow.getLastCellNum();

                // previewRowCount kadar satır oku (başlık hariç)
                int lastRow = Math.min(sheet.getLastRowNum(), previewRowCount);

                for (int i = 1; i <= lastRow; i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    Map<String, String> rowData = new LinkedHashMap<>();
                    for (int c = 0; c < maxCellNum; c++) {
                        Cell headerCell = headerRow.getCell(c);
                        Cell cell = row.getCell(c);

                        String header = headerCell != null ? headerCell.getStringCellValue() : "Column" + c;
                        String value = "";

                        if (cell != null) {
                            switch (cell.getCellType()) {
                                case STRING:
                                    value = cell.getStringCellValue();
                                    break;
                                case NUMERIC:
                                    if (DateUtil.isCellDateFormatted(cell)) {
                                        value = cell.getDateCellValue().toString();
                                    } else {
                                        value = Double.toString(cell.getNumericCellValue());
                                    }
                                    break;
                                case BOOLEAN:
                                    value = Boolean.toString(cell.getBooleanCellValue());
                                    break;
                                case FORMULA:
                                    try {
                                        value = cell.getStringCellValue();
                                    } catch (Exception e) {
                                        value = Double.toString(cell.getNumericCellValue());
                                    }
                                    break;
                                default:
                                    value = "";
                            }
                        }

                        rowData.put(header, value);
                    }
                    rows.add(rowData);
                }
                sheetData.put(sheet.getSheetName(), rows);
            }
        }
        return sheetData;
    }

    // Tam Excel dosyasını oku
    public ExcelData readFullExcel(MultipartFile file) throws Exception {
        ExcelData excelData = new ExcelData();
        
        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0); // İlk sheet'i al
            excelData.setSheetName(sheet.getSheetName());
            
            // Başlıkları oku
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                throw new Exception("Excel dosyası boş veya başlık satırı bulunamadı");
            }
            
            List<String> headers = new ArrayList<>();
            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                Cell cell = headerRow.getCell(i);
                String header = cell != null ? cell.getStringCellValue() : "Column" + i;
                headers.add(header);
            }
            excelData.setHeaders(headers);
            
            // Tüm satırları oku
            List<List<String>> rows = new ArrayList<>();
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                List<String> rowData = new ArrayList<>();
                for (int j = 0; j < headers.size(); j++) {
                    Cell cell = row.getCell(j);
                    String value = getCellValueAsString(cell);
                    rowData.add(value);
                }
                rows.add(rowData);
            }
            excelData.setRows(rows);
        }
        
        return excelData;
    }
    
    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return Double.toString(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return Boolean.toString(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue();
                } catch (Exception e) {
                    return Double.toString(cell.getNumericCellValue());
                }
            default:
                return "";
        }
    }
    
    // Excel verilerini mapping'e göre dönüştür
    public List<Map<String, Object>> transformDataWithMapping(ExcelData excelData, List<Map<String, Object>> mappings) {
        List<Map<String, Object>> transformedData = new ArrayList<>();
        
        // Mapping boşsa, tüm Excel verilerini direkt kullan
        if (mappings == null || mappings.isEmpty()) {
            System.out.println("Mapping boş, Excel verilerini direkt kullanıyoruz");
            for (List<String> row : excelData.getRows()) {
                Map<String, Object> transformedRow = new HashMap<>();
                for (int i = 0; i < excelData.getHeaders().size() && i < row.size(); i++) {
                    String header = excelData.getHeaders().get(i);
                    String value = row.get(i);
                    transformedRow.put(header, value);
                }
                if (!transformedRow.isEmpty()) {
                    transformedData.add(transformedRow);
                }
            }
            return transformedData;
        }
        
        // Mapping varsa, mapping'e göre dönüştür
        for (List<String> row : excelData.getRows()) {
            Map<String, Object> transformedRow = new HashMap<>();
            
            // Önce mapping'deki alanları ekle
            for (Map<String, Object> mapping : mappings) {
                String excelColumn = (String) mapping.get("excelColumn");
                String grispiField = (String) mapping.get("grispiField");
                
                // Excel kolonunun index'ini bul
                int columnIndex = excelData.getHeaders().indexOf(excelColumn);
                if (columnIndex >= 0 && columnIndex < row.size()) {
                    String value = row.get(columnIndex);
                    transformedRow.put(grispiField, value);
                }
            }
            
            // Sonra mapping'de olmayan ama önemli alanları da ekle
            for (int i = 0; i < excelData.getHeaders().size() && i < row.size(); i++) {
                String header = excelData.getHeaders().get(i);
                String value = row.get(i);
                
                // Mapping'de bu header yoksa ve önemli bir alansa ekle
                boolean isMapped = mappings.stream()
                    .anyMatch(mapping -> header.equals(mapping.get("excelColumn")));
                
                if (!isMapped && !transformedRow.containsKey(header)) {
                    // Önemli alanları kontrol et (emails, phone, externalId, firstName, lastName, vb.)
                    String lowerHeader = header.toLowerCase();
                    if (lowerHeader.contains("email") || lowerHeader.contains("mail") ||
                        lowerHeader.contains("phone") || lowerHeader.contains("tel") ||
                        lowerHeader.contains("external") || lowerHeader.contains("id") ||
                        lowerHeader.contains("first") || lowerHeader.contains("last") ||
                        lowerHeader.contains("name") || lowerHeader.contains("role") ||
                        lowerHeader.contains("language") || lowerHeader.contains("organization") ||
                        lowerHeader.contains("group") || lowerHeader.contains("tag") ||
                        lowerHeader.contains("enabled")) {
                        transformedRow.put(header, value);
                    }
                }
            }
            
            if (!transformedRow.isEmpty()) {
                transformedData.add(transformedRow);
            }
        }
        
        return transformedData;
    }
    
    // Excel verilerini kaydet
    public ImportResult saveExcelData(String importType, List<Map<String, Object>> data) {
        ImportResult result = new ImportResult();
        result.setImportType(importType);
        result.setTotalRecords(data.size());
        result.setSuccessCount(0);
        result.setErrorCount(0);
        result.setErrors(new ArrayList<>());
        
        // ImportType'a göre ilgili service'i çağır
        switch (importType) {
            case "Contact":
                UserService.ImportResult userResult = userService.importUsersFromExcel(data);
                result.setSuccessCount(userResult.getSuccessCount());
                result.setErrorCount(userResult.getErrorCount());
                result.setErrors(userResult.getErrors());
                break;
            case "Organization":
                OrganizationService.ImportResult orgResult = organizationService.importOrganizationsFromExcel(data, organizationMapper);
                result.setSuccessCount(orgResult.getSuccessCount());
                result.setErrorCount(orgResult.getErrorCount());
                result.setErrors(orgResult.getErrors());
                break;
            case "Ticket":
                // TODO: TicketService implement et
                result.setSuccessCount(data.size());
                break;
            default:
                result.setErrorCount(data.size());
                result.getErrors().add("Desteklenmeyen import türü: " + importType);
        }
        
        return result;
    }
    
    // ExcelData sınıfı
    public static class ExcelData {
        private String sheetName;
        private List<String> headers;
        private List<List<String>> rows;
        
        // Getters and Setters
        public String getSheetName() { return sheetName; }
        public void setSheetName(String sheetName) { this.sheetName = sheetName; }
        
        public List<String> getHeaders() { return headers; }
        public void setHeaders(List<String> headers) { this.headers = headers; }
        
        public List<List<String>> getRows() { return rows; }
        public void setRows(List<List<String>> rows) { this.rows = rows; }
    }
    
    // ImportResult sınıfı
    public static class ImportResult {
        private String importType;
        private int totalRecords;
        private int successCount;
        private int errorCount;
        private List<String> errors;
        
        // Getters and Setters
        public String getImportType() { return importType; }
        public void setImportType(String importType) { this.importType = importType; }
        
        public int getTotalRecords() { return totalRecords; }
        public void setTotalRecords(int totalRecords) { this.totalRecords = totalRecords; }
        
        public int getSuccessCount() { return successCount; }
        public void setSuccessCount(int successCount) { this.successCount = successCount; }
        
        public int getErrorCount() { return errorCount; }
        public void setErrorCount(int errorCount) { this.errorCount = errorCount; }
        
        public List<String> getErrors() { return errors; }
        public void setErrors(List<String> errors) { this.errors = errors; }
    }
}
