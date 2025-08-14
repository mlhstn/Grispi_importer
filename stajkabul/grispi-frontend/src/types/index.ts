export type ImportType = 'User' | 'Organization' | 'Group' | 'Ticket' | 'CustomField';

export interface ExcelData {
  headers: string[];
  rows: string[][];
  sheetName: string;
}

export interface MappingField {
  excelColumn: string;
  grispiField: string;
  sampleData: string[];
}

export interface MappingResult {
  importType: ImportType;
  mappings: MappingField[];
  totalRows: number;
  mappedFields: number;
}

export interface GrispiField {
  value: string;
  label: string;
  type: string;
  description?: string;
}

export const GRISPI_FIELDS: Record<ImportType, GrispiField[]> = {
  User: [
    { value: 'externalId', label: 'Dış ID', type: 'string', description: 'Grispi sistemindeki benzersiz kimlik (boşsa otomatik oluşturulur)' },
    { value: 'firstName', label: 'Ad', type: 'string', description: 'Kullanıcının adı' },
    { value: 'lastName', label: 'Soyad', type: 'string', description: 'Kullanıcının soyadı' },
    { value: 'phone', label: 'Telefon', type: 'string', description: 'E.164 formatında telefon numarası (+90... şeklinde)' },
    { value: 'emails', label: 'E-postalar', type: 'array', description: 'Virgülle ayrılmış email listesi' },
    { value: 'tags', label: 'Etiketler', type: 'array', description: 'Boşlukla ayrılmış etiket listesi' },
    { value: 'role', label: 'Rol', type: 'enum', description: 'Kullanıcı rolü (varsayılan: CUSTOMER)' },
    { value: 'language', label: 'Dil', type: 'enum', description: 'Kullanıcı dili (varsayılan: TR)' },
    { value: 'organization', label: 'Organizasyon', type: 'string', description: 'Organizasyon Grispi ID (yoksa otomatik oluşturulur)' },
    { value: 'groups', label: 'Gruplar', type: 'array', description: 'Boşlukla ayrılmış grup isimleri (yoksa otomatik oluşturulur)' },
    { value: 'enabled', label: 'Aktif', type: 'boolean', description: 'Kullanıcı aktif mi? (varsayılan: true)' }
  ],
  Organization: [
    { value: 'externalId', label: 'Dış ID', type: 'string', description: 'Grispi sistemindeki organizasyon kimliği' },
    { value: 'name', label: 'Organizasyon Adı', type: 'string', description: 'Organizasyon adı' },
    { value: 'description', label: 'Açıklama', type: 'string', description: 'Organizasyon açıklaması' },
    { value: 'details', label: 'Detaylar', type: 'string', description: 'Organizasyon detayları' },
    { value: 'notes', label: 'Notlar', type: 'string', description: 'Organizasyon notları' },
    { value: 'group', label: 'Grup', type: 'string', description: 'Grup adı (yoksa atanmaz)' },
    { value: 'domains', label: 'Domainler', type: 'array', description: 'Virgülle ayrılmış domain listesi' },
    { value: 'tags', label: 'Etiketler', type: 'array', description: 'Boşlukla ayrılmış etiket listesi' }
  ],
  Group: [
    { value: 'name', label: 'Grup Adı', type: 'string', description: 'Grup adı' }
  ],
  Ticket: [
    { value: 'externalId', label: 'Dış ID', type: 'string', description: 'Grispi sistemindeki bilet kimliği' },
    { value: 'subject', label: 'Konu', type: 'string', description: 'Bilet konusu (en az 3 karakter)' },
    { value: 'description', label: 'Açıklama', type: 'string', description: 'Bilet açıklaması' },
    { value: 'creator', label: 'Oluşturan', type: 'string', description: 'Oluşturan kullanıcının Grispi ID' },
    { value: 'requester', label: 'Talep Eden', type: 'string', description: 'Talep eden kullanıcının Grispi ID' },
    { value: 'assignee', label: 'Atanan', type: 'string', description: 'Atanan kullanıcının Grispi ID' },
    { value: 'assigneeGroup', label: 'Atanan Grup', type: 'string', description: 'Atanan grubun adı' },
    { value: 'organization', label: 'Organizasyon', type: 'string', description: 'Organizasyonun Grispi ID' },
    { value: 'status', label: 'Durum', type: 'enum', description: 'Bilet durumu' },
    { value: 'channel', label: 'Kanal', type: 'enum', description: 'Bilet kanalı' },
    { value: 'type', label: 'Tür', type: 'enum', description: 'Bilet tipi' },
    { value: 'priority', label: 'Öncelik', type: 'enum', description: 'Bilet önceliği' },
    { value: 'form', label: 'Form', type: 'string', description: 'Bilet formu' },
    { value: 'createdAt', label: 'Oluşturulma Tarihi', type: 'date', description: 'YYYY-MM-DDTHH:mm:ss formatında' },
    { value: 'updatedAt', label: 'Güncelleme Tarihi', type: 'date', description: 'YYYY-MM-DDTHH:mm:ss formatında' },
    { value: 'solvedAt', label: 'Çözülme Tarihi', type: 'date', description: 'YYYY-MM-DDTHH:mm:ss formatında' },
    { value: 'tags', label: 'Etiketler', type: 'array', description: 'Boşlukla ayrılmış etiket listesi' }
  ],
  CustomField: [
    { value: 'key', label: 'Alan Anahtarı', type: 'string', description: 'Alan anahtarı' },
    { value: 'type', label: 'Alan Türü', type: 'enum', description: 'Alan tipi' },
    { value: 'name', label: 'Alan Adı', type: 'string', description: 'Alan adı' },
    { value: 'description', label: 'Açıklama', type: 'string', description: 'Alan açıklaması' },
    { value: 'permission', label: 'Yetki Seviyesi', type: 'enum', description: 'Alan izni' },
    { value: 'required', label: 'Zorunlu', type: 'boolean', description: 'Alan zorunlu mu?' },
    { value: 'descriptionForAgents', label: 'Ajanlar İçin Açıklama', type: 'string', description: 'Ajanlar için açıklama' },
    { value: 'descriptionForCustomers', label: 'Müşteriler İçin Açıklama', type: 'string', description: 'Müşteriler için açıklama' },
    { value: 'titleForAgents', label: 'Ajanlar İçin Başlık', type: 'string', description: 'Ajanlar için başlık' },
    { value: 'titleForCustomers', label: 'Müşteriler İçin Başlık', type: 'string', description: 'Müşteriler için başlık' },
    { value: 'enabled', label: 'Aktif', type: 'boolean', description: 'Alan aktif mi?' },
    { value: 'options', label: 'Seçenekler', type: 'array', description: '$ ile ayrılmış seçenek listesi (DROPDOWN tipi için)' }
  ]
};