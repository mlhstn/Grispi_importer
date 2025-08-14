export interface FieldConfig {
  value: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'object' | 'date';
  required?: boolean;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    options?: string[];
  };
  description?: string;
}

export interface ImportTypeConfig {
  name: string;
  displayName: string;
  icon: string;
  description: string;
  fields: FieldConfig[];
  apiEndpoint: string;
  validationEndpoint: string;
  color: string;
}

export interface StepConfig {
  id: string;
  title: string;
  icon: string;
  component: string;
  order: number;
  enabled: boolean;
}

export interface ImportConfig {
  importTypes: Record<string, ImportTypeConfig>;
  steps: StepConfig[];
  ui: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
    };
    layout: {
      sidebarWidth: number;
      headerHeight: number;
    };
  };
}

// Dinamik konfigürasyon
export const IMPORT_CONFIG: ImportConfig = {
  importTypes: {
    User: {
      name: 'User',
      displayName: 'Kullanıcı',
      icon: 'UserOutlined',
      description: 'Müşteri ve kullanıcı bilgilerini içe aktarın',
      color: '#1890ff',
      apiEndpoint: '/api/users/import',
      validationEndpoint: '/api/users/validate',
      fields: [
        {
          value: 'externalId',
          label: 'Dış ID',
          type: 'string',
          required: true,
          description: 'Grispi sistemindeki benzersiz kimlik (boşsa otomatik oluşturulur)'
        },
        {
          value: 'firstName',
          label: 'Ad',
          type: 'string',
          required: true,
          validation: { min: 2, max: 50 },
          description: 'Kullanıcının adı (zorunlu)'
        },
        {
          value: 'lastName',
          label: 'Soyad',
          type: 'string',
          required: true,
          validation: { min: 2, max: 50 },
          description: 'Kullanıcının soyadı (zorunlu)'
        },
        {
          value: 'phone',
          label: 'Telefon',
          type: 'string',
          required: false,
          validation: { pattern: '^[+]?[0-9\\s\\-()]+$' },
          description: 'E.164 formatında telefon numarası (+90... şeklinde)'
        },
        {
          value: 'emails',
          label: 'E-postalar',
          type: 'array',
          required: false,
          validation: { pattern: '^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$' },
          description: 'Virgülle ayrılmış email listesi'
        },
        {
          value: 'phones',
          label: 'Telefonlar',
          type: 'array',
          required: false,
          description: 'Virgülle ayrılmış telefon listesi'
        },
        {
          value: 'tags',
          label: 'Etiketler',
          type: 'array',
          required: false,
          description: 'Boşlukla ayrılmış etiket listesi'
        },
        {
          value: 'role',
          label: 'Rol',
          type: 'enum',
          required: true,
          validation: { options: ['ADMIN', 'AGENT', 'CUSTOMER'] },
          description: 'Kullanıcı rolü (varsayılan: CUSTOMER)'
        },
        {
          value: 'language',
          label: 'Dil',
          type: 'enum',
          required: false,
          validation: { options: ['TR', 'EN', 'DE', 'FR'] },
          description: 'Kullanıcı dili (varsayılan: TR)'
        },
        {
          value: 'organization',
          label: 'Organizasyon',
          type: 'string',
          required: false,
          description: 'Organizasyon Grispi ID (yoksa otomatik oluşturulur)'
        },
        {
          value: 'groups',
          label: 'Gruplar',
          type: 'array',
          required: false,
          description: 'Boşlukla ayrılmış grup isimleri (yoksa otomatik oluşturulur)'
        },
        {
          value: 'enabled',
          label: 'Aktif',
          type: 'boolean',
          required: false,
          description: 'Kullanıcı aktif mi? (varsayılan: true)'
        }
      ]
    },
    Organization: {
      name: 'Organization',
      displayName: 'Organizasyon',
      icon: 'BankOutlined',
      description: 'Şirket ve organizasyon bilgilerini içe aktarın',
      color: '#fa8c16',
      apiEndpoint: '/api/organizations/import',
      validationEndpoint: '/api/organizations/validate',
      fields: [
        {
          value: 'externalId',
          label: 'Dış ID',
          type: 'string',
          required: true,
          description: 'Grispi sistemindeki organizasyon kimliği (zorunlu)'
        },
        {
          value: 'name',
          label: 'Organizasyon Adı',
          type: 'string',
          required: true,
          validation: { min: 2, max: 100 },
          description: 'Organizasyon adı (zorunlu)'
        },
        {
          value: 'description',
          label: 'Açıklama',
          type: 'string',
          required: false,
          description: 'Organizasyon açıklaması'
        },
        {
          value: 'details',
          label: 'Detaylar',
          type: 'string',
          required: false,
          description: 'Organizasyon detayları'
        },
        {
          value: 'notes',
          label: 'Notlar',
          type: 'string',
          required: false,
          description: 'Organizasyon notları'
        },
        {
          value: 'group',
          label: 'Grup',
          type: 'string',
          required: false,
          description: 'Grup adı (yoksa atanmaz)'
        },
        {
          value: 'domains',
          label: 'Domainler',
          type: 'array',
          required: false,
          description: 'Virgülle ayrılmış domain listesi'
        },
        {
          value: 'tags',
          label: 'Etiketler',
          type: 'array',
          required: false,
          description: 'Boşlukla ayrılmış etiket listesi'
        }
      ]
    },
    Ticket: {
      name: 'Ticket',
      displayName: 'Bilet',
      icon: 'FileTextOutlined',
      description: 'Destek biletlerini içe aktarın',
      color: '#52c41a',
      apiEndpoint: '/api/tickets/import',
      validationEndpoint: '/api/tickets/validate',
      fields: [
        {
          value: 'externalId',
          label: 'Dış ID',
          type: 'string',
          required: true,
          description: 'Grispi sistemindeki bilet kimliği (zorunlu)'
        },
        {
          value: 'subject',
          label: 'Konu',
          type: 'string',
          required: false,
          validation: { min: 3, max: 200 },
          description: 'Bilet konusu (en az 3 karakter)'
        },
        {
          value: 'description',
          label: 'Açıklama',
          type: 'string',
          required: false,
          description: 'Bilet açıklaması'
        },
        {
          value: 'status',
          label: 'Durum',
          type: 'enum',
          required: false,
          validation: { options: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] },
          description: 'Bilet durumu'
        },
        {
          value: 'priority',
          label: 'Öncelik',
          type: 'enum',
          required: false,
          validation: { options: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
          description: 'Bilet önceliği'
        },
        {
          value: 'type',
          label: 'Tip',
          type: 'enum',
          required: false,
          validation: { options: ['BUG', 'FEATURE', 'QUESTION', 'TASK'] },
          description: 'Bilet tipi'
        },
        {
          value: 'channel',
          label: 'Kanal',
          type: 'enum',
          required: false,
          validation: { options: ['EMAIL', 'PHONE', 'CHAT', 'WEB'] },
          description: 'Bilet kanalı'
        },
        {
          value: 'form',
          label: 'Form',
          type: 'string',
          required: false,
          description: 'Bilet formu'
        },
        {
          value: 'createdAt',
          label: 'Oluşturulma Tarihi',
          type: 'date',
          required: false,
          description: 'YYYY-MM-DDTHH:mm:ss formatında'
        },
        {
          value: 'updatedAt',
          label: 'Güncellenme Tarihi',
          type: 'date',
          required: false,
          description: 'YYYY-MM-DDTHH:mm:ss formatında'
        },
        {
          value: 'solvedAt',
          label: 'Çözülme Tarihi',
          type: 'date',
          required: false,
          description: 'YYYY-MM-DDTHH:mm:ss formatında'
        },
        {
          value: 'creator',
          label: 'Oluşturan',
          type: 'string',
          required: false,
          description: 'Oluşturan kullanıcının Grispi ID'
        },
        {
          value: 'requester',
          label: 'Talep Eden',
          type: 'string',
          required: false,
          description: 'Talep eden kullanıcının Grispi ID'
        },
        {
          value: 'assignee',
          label: 'Atanan',
          type: 'string',
          required: false,
          description: 'Atanan kullanıcının Grispi ID'
        },
        {
          value: 'assigneeGroup',
          label: 'Atanan Grup',
          type: 'string',
          required: false,
          description: 'Atanan grubun adı'
        },
        {
          value: 'organization',
          label: 'Organizasyon',
          type: 'string',
          required: false,
          description: 'Organizasyonun Grispi ID'
        },
        {
          value: 'tags',
          label: 'Etiketler',
          type: 'array',
          required: false,
          description: 'Boşlukla ayrılmış etiket listesi'
        }
      ]
    },
    Group: {
      name: 'Group',
      displayName: 'Grup',
      icon: 'TeamOutlined',
      description: 'Kullanıcı gruplarını içe aktarın',
      color: '#722ed1',
      apiEndpoint: '/api/groups/import',
      validationEndpoint: '/api/groups/validate',
      fields: [
        {
          value: 'name',
          label: 'Grup Adı',
          type: 'string',
          required: true,
          validation: { min: 2, max: 100 },
          description: 'Grup adı (zorunlu)'
        }
      ]
    },
    CustomField: {
      name: 'CustomField',
      displayName: 'Özel Alan',
      icon: 'FormOutlined',
      description: 'Özel alanları içe aktarın',
      color: '#13c2c2',
      apiEndpoint: '/api/custom-fields/import',
      validationEndpoint: '/api/custom-fields/validate',
      fields: [
        {
          value: 'key',
          label: 'Anahtar',
          type: 'string',
          required: true,
          description: 'Alan anahtarı (zorunlu)'
        },
        {
          value: 'type',
          label: 'Tip',
          type: 'enum',
          required: true,
          validation: { options: ['TEXT', 'NUMBER', 'DATE', 'CHECKBOX', 'DROPDOWN'] },
          description: 'Alan tipi (zorunlu)'
        },
        {
          value: 'name',
          label: 'Ad',
          type: 'string',
          required: true,
          description: 'Alan adı (zorunlu)'
        },
        {
          value: 'description',
          label: 'Açıklama',
          type: 'string',
          required: false,
          description: 'Alan açıklaması'
        },
        {
          value: 'permission',
          label: 'İzin',
          type: 'enum',
          required: true,
          validation: { options: ['READ-WRITE', 'READ-ONLY', 'AGENT_ONLY', 'CUSTOMER_ONLY'] },
          description: 'Alan izni (zorunlu)'
        },
        {
          value: 'required',
          label: 'Zorunlu',
          type: 'boolean',
          required: false,
          description: 'Alan zorunlu mu?'
        },
        {
          value: 'descriptionForAgents',
          label: 'Ajanlar İçin Açıklama',
          type: 'string',
          required: false,
          description: 'Ajanlar için açıklama'
        },
        {
          value: 'descriptionForCustomers',
          label: 'Müşteriler İçin Açıklama',
          type: 'string',
          required: false,
          description: 'Müşteriler için açıklama'
        },
        {
          value: 'titleForAgents',
          label: 'Ajanlar İçin Başlık',
          type: 'string',
          required: false,
          description: 'Ajanlar için başlık'
        },
        {
          value: 'titleForCustomers',
          label: 'Müşteriler İçin Başlık',
          type: 'string',
          required: false,
          description: 'Müşteriler için başlık'
        },
        {
          value: 'enabled',
          label: 'Aktif',
          type: 'boolean',
          required: false,
          description: 'Alan aktif mi?'
        },
        {
          value: 'options',
          label: 'Seçenekler',
          type: 'array',
          required: false,
          description: '$ ile ayrılmış seçenek listesi (DROPDOWN tipi için)'
        }
      ]
    }
  },
  steps: [
    { id: 'upload', title: 'Yükle', icon: 'UploadOutlined', component: 'UploadStep', order: 1, enabled: true },
    { id: 'preview', title: 'Önizle', icon: 'EyeOutlined', component: 'DataPreviewStep', order: 2, enabled: true },
    { id: 'mapping', title: 'Eşleştir', icon: 'LinkOutlined', component: 'MappingStep', order: 3, enabled: true },
    { id: 'summary', title: 'Özet', icon: 'CheckCircleOutlined', component: 'SummaryStep', order: 4, enabled: true },
    { id: 'result', title: 'Sonuç', icon: 'FileTextOutlined', component: 'ResultStep', order: 5, enabled: true }
  ],
  ui: {
    theme: {
      primaryColor: '#9b51e0',
      secondaryColor: '#2c2450'
    },
    layout: {
      sidebarWidth: 250,
      headerHeight: 64
    }
  }
};

// Yeni import türü ekleme fonksiyonu
export const addImportType = (config: ImportTypeConfig) => {
  IMPORT_CONFIG.importTypes[config.name] = config;
};

// Konfigürasyonu API'den yükleme
export const loadConfigFromAPI = async (): Promise<ImportConfig> => {
  try {
    const response = await fetch('/api/config/import');
    return await response.json();
  } catch (error) {
    console.warn('API konfigürasyonu yüklenemedi, varsayılan kullanılıyor:', error);
    return IMPORT_CONFIG;
  }
};
