# Grispi Import API Documentation

## Overview
Bu API, Excel dosyalarından Grispi sistemine veri import etmek için kullanılır.

## Import Types

### 1. User Import

#### Fields
- `externalId` (string, optional): Dış ID - boşsa otomatik oluşturulur
- `firstName` (string, required): Kullanıcının adı
- `lastName` (string, required): Kullanıcının soyadı
- `phone` (string, required): E.164 formatında telefon numarası (+90... şeklinde)
- `emails` (array, optional): Virgülle ayrılmış email listesi
- `tags` (array, optional): Boşlukla ayrılmış etiket listesi
- `role` (enum, optional): Kullanıcı rolü (ADMIN, AGENT, CUSTOMER) - varsayılan: CUSTOMER
- `language` (enum, optional): Kullanıcı dili (TR, EN) - varsayılan: TR
- `organization` (string, optional): Organizasyon Grispi ID - yoksa otomatik oluşturulur
- `groups` (array, optional): Boşlukla ayrılmış grup isimleri - yoksa otomatik oluşturulur
- `enabled` (boolean, optional): Kullanıcı aktif mi? - varsayılan: true

#### Notes
- `phones` alanı kaldırılmıştır. Artık sadece tek bir `phone` alanı kullanılır.
- Telefon numaraları E.164 formatında olmalıdır (+90...)
- 10 haneli Türk telefon numaraları otomatik olarak +90 ile başlatılır

### 2. Organization Import

#### Fields
- `externalId` (string, optional): Dış ID
- `name` (string, required): Organizasyon adı
- `description` (string, optional): Organizasyon açıklaması
- `details` (string, optional): Organizasyon detayları
- `notes` (string, optional): Organizasyon notları
- `group` (string, optional): Grup adı
- `domains` (array, optional): Virgülle ayrılmış domain listesi
- `tags` (array, optional): Boşlukla ayrılmış etiket listesi

### 3. Group Import

#### Fields
- `name` (string, required): Grup adı

### 4. Ticket Import

#### Fields
- `externalId` (string, optional): Dış ID
- `subject` (string, required): Bilet konusu (en az 3 karakter)
- `description` (string, required): Bilet açıklaması
- `creator` (string, required): Oluşturan kullanıcının Grispi ID
- `requester` (string, required): Talep eden kullanıcının Grispi ID
- `assignee` (string, optional): Atanan kullanıcının Grispi ID
- `assigneeGroup` (string, optional): Atanan grubun adı
- `organization` (string, optional): Organizasyonun Grispi ID
- `status` (enum, optional): Bilet durumu
- `channel` (enum, optional): Bilet kanalı
- `type` (enum, optional): Bilet tipi
- `priority` (enum, optional): Bilet önceliği
- `form` (string, optional): Bilet formu
- `createdAt` (date, optional): YYYY-MM-DDTHH:mm:ss formatında
- `updatedAt` (date, optional): YYYY-MM-DDTHH:mm:ss formatında
- `solvedAt` (date, optional): YYYY-MM-DDTHH:mm:ss formatında
- `tags` (array, optional): Boşlukla ayrılmış etiket listesi

### 5. CustomField Import

#### Fields
- `key` (string, required): Alan anahtarı
- `type` (enum, required): Alan tipi
- `name` (string, required): Alan adı
- `description` (string, optional): Alan açıklaması
- `permission` (enum, optional): Alan izni
- `required` (boolean, optional): Alan zorunlu mu?
- `descriptionForAgents` (string, optional): Ajanlar için açıklama
- `descriptionForCustomers` (string, optional): Müşteriler için açıklama
- `titleForAgents` (string, optional): Ajanlar için başlık
- `titleForCustomers` (string, optional): Müşteriler için başlık
- `enabled` (boolean, optional): Alan aktif mi?
- `options` (array, optional): $ ile ayrılmış seçenek listesi (DROPDOWN tipi için)

## API Endpoints

### Import with Mapping
```
POST /api/import/{importType}/with-mapping
Content-Type: multipart/form-data

Parameters:
- file: Excel dosyası
- mappings: JSON string - mapping bilgileri
```

### Get Required Fields
```
GET /api/import/{importType}/required-fields
```

### Get Mapping Templates
```
GET /api/import/{importType}/templates
```

### Save Mapping Template
```
POST /api/import/templates
Content-Type: application/json
```

### Load Mapping Template
```
GET /api/import/templates/{templateId}
```

## Validation Rules

### User Validation
- `firstName` ve `lastName` zorunludur
- `phone` E.164 formatında olmalıdır
- `emails` geçerli email formatında olmalıdır
- `role` geçerli enum değeri olmalıdır

### Organization Validation
- `name` zorunludur

### Group Validation
- `name` zorunludur

### Ticket Validation
- `subject` en az 3 karakter olmalıdır
- `description` zorunludur
- `creator` ve `requester` zorunludur

### CustomField Validation
- `key`, `type`, `name` zorunludur

## Recent Changes

### v2.0.0 (2024-08-14)
- **BREAKING CHANGE**: User entity'den `phones` alanı kaldırıldı
- Artık sadece tek bir `phone` alanı kullanılıyor
- `user_phones` tablosu otomatik olarak kaldırılacak
- Frontend'de `phones` seçeneği kaldırıldı

## Error Handling

API hataları şu formatda döner:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## Success Response

Başarılı import işlemleri şu formatda döner:
```json
{
  "success": true,
  "totalRecords": 10,
  "successCount": 8,
  "errorCount": 2,
  "errors": ["Row 3: Invalid email format", "Row 7: Missing required field"]
}
```
