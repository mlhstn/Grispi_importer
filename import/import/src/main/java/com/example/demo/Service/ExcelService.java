package com.example.demo.Service;

import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;

@Service
public class ExcelService {

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
}
