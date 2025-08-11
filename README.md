
## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Java 21
- Node.js 18+
- Maven 3.8+

### Backend Kurulumu
```bash
cd stajkabul/import/import
mvn clean install
mvn spring-boot:run
```

Backend varsayılan olarak `http://localhost:8080` adresinde çalışır.

### Frontend Kurulumu
```bash
cd grispi-frontend
npm install
npm start
```

Frontend varsayılan olarak `http://localhost:3000` adresinde çalışır.

## 📋 Kullanım Kılavuzu

### 1. Dosya Yükleme
- "Dosya Seç" butonuna tıklayın
- Excel (.xlsx) dosyanızı seçin
- Import türünü seçin (Contact, Organization, Ticket, CustomField)

### 2. Veri Önizleme
- Yüklenen dosyanın ilk 5 satırı otomatik gösterilir
- Sütun başlıkları ve örnek veriler görüntülenir

### 3. Alan Eşleştirme
- Excel sütunlarını Grispi alanlarına sürükle-bırak ile eşleştirin
- Zorunlu alanlar kırmızı ile işaretlenir
- Eşleştirme tamamlandığında "Devam Et" butonuna tıklayın

### 4. Import İşlemi
- Sistem verileri doğrular ve kaydeder
- Başarılı/başarısız kayıtlar raporlanır
- Hata detayları gösterilir

## �� API Endpoints

### Excel İşlemleri
- `POST /api/import/excel/preview` - Excel önizleme
- `POST /api/import/{type}/import-excel` - Excel import

### Kullanıcı İşlemleri
- `POST /api/users/validate` - Kullanıcı doğrulama
- `POST /api/users/import` - Kullanıcı import
- `POST /api/users/import-mapped` - Mapping ile import

### Organizasyon İşlemleri
- `POST /api/organizations/validate` - Organizasyon doğrulama
- `POST /api/organizations/import` - Organizasyon import

### Bilet İşlemleri
- `POST /api/tickets/validate` - Bilet doğrulama
- `POST /api/tickets/import` - Bilet import

## 📊 Veri Modelleri

### User (Kullanıcı)
```json
{
  "externalId": "string",
  "firstName": "string",
  "lastName": "string",
  "phone": "string (E.164 format)",
  "emails": ["string"],
  "phones": ["string"],
  "organization": "Organization",
  "groups": ["Group"],
  "language": "TR|EN|DE",
  "role": "ADMIN|AGENT|CUSTOMER",
  "tags": ["string"],
  "enabled": "boolean"
}
```

### Organization (Organizasyon)
```json
{
  "externalId": "string",
  "name": "string",
  "description": "string",
  "domains": ["string"],
  "tags": ["string"]
}
```

## ✅ Validasyon Kuralları

### User Validasyonu
- `externalId`: Zorunlu, boş olamaz
- `firstName`: Zorunlu, boş olamaz
- `lastName`: Zorunlu, boş olamaz
- `phone`: E.164 formatında olmalı (+90XXXXXXXXXX)
- `emails`: Geçerli email formatında olmalı
- `role`: ADMIN, AGENT veya CUSTOMER olmalı

### Organization Validasyonu
- `externalId`: Zorunlu, boş olamaz
- `name`: Zorunlu, boş olamaz

## 🔄 Otomatik İşlemler

### Organization Otomatik Oluşturma
- Excel'de belirtilen organization bulunamazsa otomatik oluşturulur
- `externalId` ve `name` alanları aynı değerle set edilir

### Group Otomatik Oluşturma
- Excel'de belirtilen group bulunamazsa otomatik oluşturulur
- `name` alanı ile yeni group oluşturulur

### Telefon Formatı Düzeltme
- 10 haneli Türkiye telefon numaralarına otomatik `+90` eklenir
- E.164 formatına uygun hale getirilir

## �� Hata Yönetimi

### Validation Hataları
- Her entity için özel validator sınıfları
- Detaylı hata mesajları
- Hatalı kayıtların raporlanması

### Exception Handling
- Global exception handler
- Kullanıcı dostu hata mesajları
- Log kayıtları

## 📈 Performans

### Optimizasyonlar
- Batch processing için hazır altyapı
- Lazy loading ile memory optimizasyonu
- Connection pooling

### Ölçeklenebilirlik
- Modüler yapı
- Plugin sistemi
- Factory pattern kullanımı

## �� Güvenlik

### Veri Güvenliği
- Input validation
- SQL injection koruması
- XSS koruması

### Dosya Güvenliği
- Dosya boyutu kontrolü
- Dosya tipi kontrolü
- Güvenli dosya işleme

## 🧪 Test

### Test Stratejisi
- Unit testler
- Integration testler
- API testleri

### Test Verileri
- Örnek Excel dosyaları
- Test senaryoları
- Mock data

## �� Geliştirme Notları

### Son Güncellemeler
- Telefon validasyonu düzeltildi
- Organization/Group otomatik oluşturma eklendi
- Mapping sistemi iyileştirildi
- Debug logları eklendi

### Bilinen Sorunlar
- Yok

### Gelecek Özellikler
- CSV dosya desteği
- Bulk import optimizasyonu
- Real-time progress tracking
- Email notification sistemi

## �� Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje Sahibi - [@melih](mailto:melih@example.com)

Proje Linki: [https://github.com/username/grispi-import](https://github.com/username/grispi-import)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
