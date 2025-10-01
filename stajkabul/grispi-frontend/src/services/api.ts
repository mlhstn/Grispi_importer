const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MappingData {
  importType: string;
  mappings: any[];
  totalRows: number;
  timestamp: string;
}

export const apiService = {
  // Excel önizleme
  async previewExcel(file: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/import/excel/preview`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  // Excel dosyasını mapping ile import et
  async importExcelWithMapping(file: File, importType: string, mappings: any[]): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mappings', JSON.stringify(mappings));

      const response = await fetch(`${API_BASE_URL}/import/${importType}/import-excel`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Import error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  // Mapping data ile import
  async importWithMapping(mappingData: MappingData): Promise<ApiResponse<any>> {
    try {
      const importType = mappingData.importType;
      const endpoint = `${API_BASE_URL}/import/${importType}/import-mapping`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  // Desteklenen import türlerini al
  async getSupportedTypes(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/import/types`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  // Import türü alanlarını al
  async getImportFields(importType: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/import/${importType}/fields`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  // Mapping Template API'leri
  async saveMappingTemplate(templateData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/mapping-templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  async getMappingTemplates(importType: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/mapping-templates/${importType}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  async getDefaultTemplate(importType: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/mapping-templates/${importType}/default`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  async getTemplateById(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/mapping-templates/template/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  async updateTemplate(id: number, templateData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/mapping-templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  async deleteTemplate(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/mapping-templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  async setTemplateAsDefault(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/mapping-templates/${id}/set-default`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  // Zorunlu alanları getir
  async getRequiredFields(importType: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/import/required-fields/${importType}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  },

  // Grispi API'sine ticket gönder
  async uploadToGrispi(
    csvFile: File,
    tenantId: string,
    subject: string,
    htmlBody: string
  ): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      
      // Ticket verisini hazırla
      const ticketData = {
        fields: [
          { key: "ts.subject", value: subject },
          { key: "ts.form", value: 14 },
          { key: "ts.untrusted_end_user", value: ":team+import@grispi.com:" }
        ],
        comment: {
          body: htmlBody,
          channel: "USER_FORM",
          creator: [
            { key: "us.email", value: "team+import@grispi.com" },
            { key: "us.full_name", value: "Grispi Import User" }
          ],
          publicVisible: false
        },
        currentAttachments: {
          inlineImages: [],
          attachments: []
        }
      };

      formData.append('ticketFromClientString', JSON.stringify(ticketData));
      formData.append('attachments', csvFile);

      const response = await fetch('https://api.grispi.com/user-forms/tickets', {
        method: 'POST',
        headers: {
          'tenantId': tenantId
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      };
    }
  }
}; 