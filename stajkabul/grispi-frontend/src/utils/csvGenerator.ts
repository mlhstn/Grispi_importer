import { MappingField } from '../types';

/**
 * Excel/CSV verisinden import edilmiş veriyi CSV formatına çevirir
 * @param headers CSV başlıkları
 * @param rows CSV satırları
 * @param mappings Mapping bilgileri
 * @returns CSV string
 */
export const generateCSV = (
  headers: string[],
  rows: any[][],
  mappings: MappingField[]
): string => {
  // CSV başlık satırı oluştur
  const csvHeaders = headers.join(',');
  
  // CSV satırları oluştur
  const csvRows = rows.map(row => {
    return row.map(cell => {
      // Hücre değerini string'e çevir
      let value = cell?.toString() || '';
      
      // Eğer virgül, çift tırnak veya satır sonu içeriyorsa çift tırnak içine al
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
  }).join('\n');
  
  return `${csvHeaders}\n${csvRows}`;
};

/**
 * CSV string'ini Blob'a çevirir ve download edilebilir hale getirir
 * @param csvContent CSV içeriği
 * @param fileName Dosya adı
 */
export const downloadCSV = (csvContent: string, fileName: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * CSV string'ini File objesine çevirir
 * @param csvContent CSV içeriği
 * @param fileName Dosya adı
 * @returns File objesi
 */
export const csvToFile = (csvContent: string, fileName: string): File => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return new File([blob], fileName, { type: 'text/csv' });
};

/**
 * Mapping'e göre sadece map edilmiş kolonları içeren CSV oluşturur
 * @param headers Orijinal başlıklar
 * @param rows Orijinal satırlar
 * @param mappings Mapping bilgileri
 * @returns CSV string (sadece map edilmiş kolonlar)
 */
export const generateMappedCSV = (
  headers: string[],
  rows: any[][],
  mappings: MappingField[]
): string => {
  // Map edilmiş kolonların index'lerini bul
  const mappedIndices: number[] = [];
  const mappedHeaders: string[] = [];
  
  mappings.forEach(mapping => {
    const index = headers.indexOf(mapping.excelColumn);
    if (index !== -1) {
      mappedIndices.push(index);
      mappedHeaders.push(mapping.grispiField || mapping.excelColumn);
    }
  });
  
  // CSV başlık satırı
  const csvHeaders = mappedHeaders.join(',');
  
  // CSV satırları (sadece map edilmiş kolonlar)
  const csvRows = rows.map(row => {
    return mappedIndices.map(index => {
      let value = row[index]?.toString() || '';
      
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
  }).join('\n');
  
  return `${csvHeaders}\n${csvRows}`;
};
