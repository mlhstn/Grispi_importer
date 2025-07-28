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

## 📁 Proje Yapısı

src
├── Controller/ # API endpoint'leri
├── Service/ # İş mantığı
├── Repository/ # DB işlemleri
├── Mapper/ # Excel verisinden entity'ye dönüştürme
├── DTO/ # Veri transfer nesneleri
├── Entity/ # Veritabanı tabloları
├── Validation/ # Alan bazlı doğrulamalar
└── application.properties # Config dosyası



