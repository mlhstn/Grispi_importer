# 📦 Grispi Contacts Importer

Grispi Contacts Importer, farklı kaynaklardan gelen (Excel .xlsx formatında) kullanıcı (User), organizasyon (Organization), destek bileti (Ticket) ve
özel alan (CustomField) verilerini Grispi sistemine uygun formata dönüştürmek,
doğrulamak ve kalıcı olarak SQLite veritabanına kaydetmek için geliştirilmiş bir Spring Boot uygulamasıdır.

---

## 🚀 Proje Amacı

Kullanıcıların ellerindeki .xlsx formatındaki kontak verilerini kolayca Grispi sistemine entegre edebilmesini sağlayan bir import aracı geliştirmek. Proje şu temel özellikleri sağlar:

- Excel dosyası yükleme
- İlk birkaç satırın önizlenmesi
- Sütunların Grispi alanları ile eşleştirilmesi
- Verilerin doğrulanması (validation)
- Başarılı/hatalı kayıtların raporlanması
- Veritabanına (SQLite) kalıcı kayıt işlemi

---

## 🧩 Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|----------|----------|
| Java 17 | Backend dili |
| Spring Boot | Uygulama çatısı |
| Spring Data JPA | ORM işlemleri |
| Hibernate | Veritabanı bağlantısı |
| SQLite | Hafif veritabanı |
| Apache POI | Excel okuma/yazma |
| Postman | Test ortamı |
| JSON | Veri formatı |

---

## 📁 İşleyiş Aşamaları


1. ✉️ Excel Dosyası Yükleme

Kullanıcı bir .xlsx dosyası yükler.

Her sheet farklı bir varlık (User, Ticket vb.) içerebilir.

2. 🔍 Önizleme (Preview) Aşaması

Her sheet'ten ilk 5 satır (başlık + veri) okunur.

Kullanıcıya JSON formatında gösterilir.

3. 🔀 Dinamik Eşleştirme

Kullanıcı, Excel sütunlarını Grispi alan adlarına eşleştirir.

{
  "columnMappings": {
    "First Name": "firstName",
    "Emails": "emails"
  }
}

4. ✅ Doğrulama (Validation)

Her entity için kendi validator sınıfı yazılmıştır.

Enum alanları, zorunlu alanlar, e-posta formatları gibi kurallar denetlenir.

5. 🔄 Mapping ve Kayıt

Excel satırları Map<String, Object> olarak alınır.

Mapper sınıfları aracılığıyla entity'lere dönüştürülür.

Veriler Service sınıfı aracılığıyla Repository katmanına iletilir.

6. 📊 Raporlama

Kayıtlar başarılı ise savedUsers, savedOrganizations gibi listelerde dönülür.

Eksik/hatalı olanlar failedUsers gibi alanlarda detaylı hata mesajları ile birlikte sunulur.

 Neden Dinamik Mapping?

Farklı kurumların Excel sütun adları farklı olabilir. Bu sistem sabit alanlara bağlı kalmadan, 
kullanıcının sütunları kendi seçmesine izin verir. Bu sayede her tür dosya desteklenebilir hale gelir.

