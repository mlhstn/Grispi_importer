package com.example.demo.Service;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

public interface ImportService {
    Map<String, Object> importExcelWithMapping(MultipartFile file, String mappingsJson);
}
