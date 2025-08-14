import { ImportPlugin, ValidationResult } from '../PluginManager';
import { ImportTypeConfig } from '../../config/importConfig';

export default class ContactPlugin implements ImportPlugin {
  name = 'Contact';
  version = '1.0.0';
  
  config: ImportTypeConfig = {
    name: 'Contact',
    displayName: 'Kişi',
    icon: 'UserOutlined',
    description: 'Müşteri ve kullanıcı bilgilerini içe aktarın',
    color: '#1890ff',
    apiEndpoint: '/api/import/Contact',
    validationEndpoint: '/api/import/Contact/validate',
    fields: [
      {
        value: 'externalId',
        label: 'Dış ID',
        type: 'string',
        required: false,
        description: 'Harici sistemdeki benzersiz kimlik'
      },
      {
        value: 'firstName',
        label: 'Ad',
        type: 'string',
        required: true,
        validation: { min: 2, max: 50 }
      },
      {
        value: 'lastName',
        label: 'Soyad',
        type: 'string',
        required: true,
        validation: { min: 2, max: 50 }
      },
      {
        value: 'phone',
        label: 'Telefon',
        type: 'string',
        validation: { pattern: '^[+]?[0-9\\s\\-()]+$' }
      },
      {
        value: 'emails',
        label: 'E-postalar',
        type: 'array',
        validation: { pattern: '^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$' }
      },
      {
        value: 'language',
        label: 'Dil',
        type: 'enum',
        validation: { options: ['TR', 'EN', 'DE', 'FR'] }
      },
      {
        value: 'enabled',
        label: 'Aktif',
        type: 'boolean'
      }
    ]
  };
  
  async initialize(): Promise<void> {
    console.log('Contact Plugin initialized');
  }
  
  async destroy(): Promise<void> {
    console.log('Contact Plugin destroyed');
  }
  
  async validateRow(row: Record<string, any>): Promise<ValidationResult> {
    const errors: string[] = [];
    
    // Ad kontrolü
    if (!row.firstName || row.firstName.trim().length < 2) {
      errors.push('Ad en az 2 karakter olmalıdır');
    }
    
    // Soyad kontrolü
    if (!row.lastName || row.lastName.trim().length < 2) {
      errors.push('Soyad en az 2 karakter olmalıdır');
    }
    
    // E-posta kontrolü
    if (row.emails) {
      const emailRegex = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/;
      const emails = Array.isArray(row.emails) ? row.emails : [row.emails];
      
      for (const email of emails) {
        if (email && !emailRegex.test(email)) {
          errors.push(`Geçersiz e-posta formatı: ${email}`);
        }
      }
    }
    
    // Telefon kontrolü
    if (row.phone) {
      const phoneRegex = /^[+]?[0-9\s\-()]+$/;
      if (!phoneRegex.test(row.phone)) {
        errors.push('Geçersiz telefon formatı');
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
      // E-posta array'e çevir
      emails: row.emails ? (Array.isArray(row.emails) ? row.emails : [row.emails]) : [],
      // Telefon array'e çevir
      phones: row.phones ? (Array.isArray(row.phones) ? row.phones : [row.phones]) : [],
      // Boolean değerleri normalize et
      enabled: row.enabled === true || row.enabled === 'true' || row.enabled === '1'
    }));
  }
}
