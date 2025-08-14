import * as XLSX from 'xlsx';
import { ExcelData } from '../types';

export const parseExcel = (file: File): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        if (jsonData.length === 0) {
          reject(new Error('Excel dosyası boş'));
          return;
        }
        
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        
        resolve({
          headers,
          rows,
          sheetName
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.readAsArrayBuffer(file);
  });
};

export const getPreviewData = (data: ExcelData, rowCount: number = 5) => {
  return {
    headers: data.headers,
    rows: data.rows.slice(0, rowCount),
    totalRows: data.rows.length
  };
}; 