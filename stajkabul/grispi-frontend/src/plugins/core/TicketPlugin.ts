import { ImportPlugin, ValidationResult } from '../PluginManager';
import { ImportTypeConfig } from '../../config/importConfig';

export default class TicketPlugin implements ImportPlugin {
  name = 'Ticket';
  version = '1.0.0';
  
  config: ImportTypeConfig = {
    name: 'Ticket',
    displayName: 'Bilet',
    icon: 'FileTextOutlined',
    description: 'Destek biletlerini içe aktarın',
    color: '#52c41a',
    apiEndpoint: '/api/import/Ticket',
    validationEndpoint: '/api/import/Ticket/validate',
    fields: [
      {
        value: 'externalId',
        label: 'Dış ID',
        type: 'string',
        required: false,
        description: 'Harici sistemdeki benzersiz kimlik'
      },
      {
        value: 'title',
        label: 'Başlık',
        type: 'string',
        required: true,
        validation: { min: 5, max: 200 }
      },
      {
        value: 'description',
        label: 'Açıklama',
        type: 'string',
        required: true,
        validation: { min: 10 }
      },
      {
        value: 'status',
        label: 'Durum',
        type: 'enum',
        validation: { options: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] }
      },
      {
        value: 'priority',
        label: 'Öncelik',
        type: 'enum',
        validation: { options: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] }
      },
      {
        value: 'type',
        label: 'Tür',
        type: 'enum',
        validation: { options: ['QUESTION', 'INCIDENT', 'PROBLEM', 'TASK'] }
      },
      {
        value: 'assignee',
        label: 'Atanan',
        type: 'object'
      },
      {
        value: 'requester',
        label: 'Talep Eden',
        type: 'object'
      },
      {
        value: 'organization',
        label: 'Organizasyon',
        type: 'object'
      },
      {
        value: 'channel',
        label: 'Kanal',
        type: 'enum',
        validation: { options: ['EMAIL', 'WEB', 'PHONE', 'CHAT'] }
      },
      {
        value: 'tags',
        label: 'Etiketler',
        type: 'array'
      }
    ]
  };
  
  async initialize(): Promise<void> {
    console.log('Ticket Plugin initialized');
  }
  
  async destroy(): Promise<void> {
    console.log('Ticket Plugin destroyed');
  }
  
  async validateRow(row: Record<string, any>): Promise<ValidationResult> {
    const errors: string[] = [];
    
    // Başlık kontrolü
    if (!row.title || row.title.trim().length < 5) {
      errors.push('Başlık en az 5 karakter olmalıdır');
    }
    
    if (row.title && row.title.length > 200) {
      errors.push('Başlık en fazla 200 karakter olabilir');
    }
    
    // Açıklama kontrolü
    if (!row.description || row.description.trim().length < 10) {
      errors.push('Açıklama en az 10 karakter olmalıdır');
    }
    
    // Durum kontrolü
    if (row.status) {
      const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
      if (!validStatuses.includes(row.status.toUpperCase())) {
        errors.push(`Geçersiz durum: ${row.status}. Geçerli değerler: ${validStatuses.join(', ')}`);
      }
    }
    
    // Öncelik kontrolü
    if (row.priority) {
      const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
      if (!validPriorities.includes(row.priority.toUpperCase())) {
        errors.push(`Geçersiz öncelik: ${row.priority}. Geçerli değerler: ${validPriorities.join(', ')}`);
      }
    }
    
    // Kanal kontrolü
    if (row.channel) {
      const validChannels = ['EMAIL', 'WEB', 'PHONE', 'CHAT'];
      if (!validChannels.includes(row.channel.toUpperCase())) {
        errors.push(`Geçersiz kanal: ${row.channel}. Geçerli değerler: ${validChannels.join(', ')}`);
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
      // Durum normalize et
      status: row.status ? row.status.toUpperCase() : 'OPEN',
      // Öncelik normalize et
      priority: row.priority ? row.priority.toUpperCase() : 'MEDIUM',
      // Kanal normalize et
      channel: row.channel ? row.channel.toUpperCase() : 'WEB',
      // Etiketleri array'e çevir
      tags: row.tags ? (Array.isArray(row.tags) ? row.tags : row.tags.split(',').map((t: string) => t.trim())) : [],
      // Tarih alanlarını normalize et
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString()
    }));
  }
}
