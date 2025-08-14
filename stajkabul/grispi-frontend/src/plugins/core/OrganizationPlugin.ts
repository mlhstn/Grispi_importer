import { ImportPlugin, ValidationResult } from '../PluginManager';
import { ImportTypeConfig } from '../../config/importConfig';

export default class OrganizationPlugin implements ImportPlugin {
  name = 'Organization';
  version = '1.0.0';
  
  config: ImportTypeConfig = {
    name: 'Organization',
    displayName: 'Organizasyon',
    icon: 'BankOutlined',
    description: 'Şirket ve organizasyon bilgilerini içe aktarın',
    color: '#fa8c16',
    apiEndpoint: '/api/import/Organization',
    validationEndpoint: '/api/import/Organization/validate',
    fields: [
      {
        value: 'externalId',
        label: 'Dış ID',
        type: 'string',
        required: false,
        description: 'Harici sistemdeki benzersiz kimlik'
      },
      {
        value: 'name',
        label: 'Şirket Adı',
        type: 'string',
        required: true,
        validation: { min: 2, max: 100 }
      },
      {
        value: 'domain',
        label: 'Domain',
        type: 'string',
        validation: { pattern: '^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}$' }
      },
      {
        value: 'description',
        label: 'Açıklama',
        type: 'string'
      },
      {
        value: 'address',
        label: 'Adres',
        type: 'string'
      },
      {
        value: 'phone',
        label: 'Telefon',
        type: 'string',
        validation: { pattern: '^[+]?[0-9\\s\\-()]+$' }
      },
      {
        value: 'email',
        label: 'E-posta',
        type: 'string',
        validation: { pattern: '^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$' }
      },
      {
        value: 'website',
        label: 'Website',
        type: 'string',
        validation: { pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$' }
      },
      {
        value: 'tags',
        label: 'Etiketler',
        type: 'array'
      },
      {
        value: 'enabled',
        label: 'Aktif',
        type: 'boolean'
      }
    ]
  };
  
  async initialize(): Promise<void> {
    console.log('Organization Plugin initialized');
  }
  
  async destroy(): Promise<void> {
    console.log('Organization Plugin destroyed');
  }
  
  async validateRow(row: Record<string, any>): Promise<ValidationResult> {
    const errors: string[] = [];
    
    // Şirket adı kontrolü
    if (!row.name || row.name.trim().length < 2) {
      errors.push('Şirket adı en az 2 karakter olmalıdır');
    }
    
    if (row.name && row.name.length > 100) {
      errors.push('Şirket adı en fazla 100 karakter olabilir');
    }
    
    // Domain kontrolü
    if (row.domain) {
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(row.domain)) {
        errors.push(`Geçersiz domain formatı: ${row.domain}`);
      }
    }
    
    // E-posta kontrolü
    if (row.email) {
      const emailRegex = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(row.email)) {
        errors.push(`Geçersiz e-posta formatı: ${row.email}`);
      }
    }
    
    // Telefon kontrolü
    if (row.phone) {
      const phoneRegex = /^[+]?[0-9\s\-()]+$/;
      if (!phoneRegex.test(row.phone)) {
        errors.push('Geçersiz telefon formatı');
      }
    }
    
    // Website kontrolü
    if (row.website) {
      const websiteRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      if (!websiteRegex.test(row.website)) {
        errors.push(`Geçersiz website formatı: ${row.website}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  async transformData(data: any[]): Promise<any[]> {
    return data.map(row => ({
      ...row,
      // Şirket adını normalize et
      name: row.name ? row.name.trim() : '',
      // Domain'i küçük harfe çevir
      domain: row.domain ? row.domain.toLowerCase().trim() : '',
      // E-postayı küçük harfe çevir
      email: row.email ? row.email.toLowerCase().trim() : '',
      // Website URL'ini normalize et
      website: row.website ? (row.website.startsWith('http') ? row.website : `https://${row.website}`) : '',
      // Etiketleri array'e çevir
      tags: row.tags ? (Array.isArray(row.tags) ? row.tags : row.tags.split(',').map((t: string) => t.trim())) : [],
      // Boolean değerleri normalize et
      enabled: row.enabled === true || row.enabled === 'true' || row.enabled === '1',
      // Tarih alanlarını normalize et
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString()
    }));
  }
}
