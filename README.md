# 📊 Grispi Data Import Tool

Modern, plugin tabanlı Excel veri aktarım platformu. Grispi sistemine toplu veri yüklemeleri için gelişmiş bir web uygulaması.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.18-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Stack](#-teknoloji-stack)
- [Proje Yapısı](#-proje-yapısı)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Geliştirme](#-geliştirme)

## ✨ Özellikler

### 🎯 Temel Özellikler
- **Excel İçe Aktarma**: `.xlsx` dosyalarından toplu veri yükleme
- **Dinamik Eşleştirme**: Excel sütunlarını sistem alanlarıyla eşleştirme
- **Gerçek Zamanlı Doğrulama**: Anında veri doğrulama ve hata raporlama
- **Çoklu Dil Desteği**: Türkçe, İngilizce, Almanca
- **Modern UI**: Responsive tasarım

### 📦 Desteklenen Veri Tipleri
1. **User (Kullanıcı)** - Kullanıcı bilgileri, roller, gruplar
2. **Ticket (Bilet)** - Destek talepleri ve biletler
3. **CustomField (Özel Alan)** - Dinamik form alanları

### 🎨 Kullanıcı Deneyimi
- **5 Adımlı Wizard**: Dosya yükleme → Önizleme → Eşleştirme → Özet → Sonuç
- **Veri Önizleme**: Import öncesi veri kontrolü
- **Mapping Template**: Eşleştirme şablonlarını kaydetme/yükleme
- **Detaylı Raporlama**: Başarılı/başarısız kayıt raporları
- **Hata Yönetimi**: Anlaşılır hata mesajları ve çözüm önerileri

## 🛠 Teknoloji Stack

### Backend
```
Java 21
Spring Boot 2.7.18
Spring Data JPA
Hibernate 5.6.15
SQLite Database
Apache POI (Excel processing)
Lombok
```

### Frontend
```
React 18.3.1
TypeScript 4.9.5
Ant Design 5.26.7
i18next (Internationalization)
XLSX (Excel parsing)
React Hooks
```

### Mimari Özellikler
- **RESTful API** - Standard HTTP endpoints
- **Plugin Pattern** - Genişletilebilir mimari
- **Factory Pattern** - Service factory yapısı
- **Repository Pattern** - Data access layer
- **DTO Pattern** - Data transfer objects
- **Validation Layer** - Çok katmanlı doğrulama

## 📁 Proje Yapısı

```
grispi-staj/
├── stajkabul/
│   ├── grispi-frontend/          # React Frontend
│   │   ├── src/
│   │   │   ├── components/       # Reusable components
│   │   │   ├── pages/           # Step components
│   │   │   ├── services/        # API services
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── i18n/            # Language files
│   │   │   ├── types/           # TypeScript types
│   │   │   ├── utils/           # Helper functions
│   │   │   ├── config/          # Configuration files
│   │   │   └── plugins/         # Frontend plugins
│   │   └── package.json
│   │
│   ├── import/import/            # Spring Boot Backend
│   │   ├── src/main/java/com/example/demo/
│   │   │   ├── ApiClient/       # External API clients
│   │   │   ├── Config/          # Spring configuration
│   │   │   ├── Controller/      # REST controllers
│   │   │   ├── DTO/             # Data Transfer Objects
│   │   │   ├── Entity/          # JPA entities
│   │   │   ├── Factory/         # Factory classes
│   │   │   ├── Mapper/          # Data mappers
│   │   │   ├── Plugin/          # Plugin system
│   │   │   ├── Repository/      # Data repositories
│   │   │   ├── Service/         # Business logic
│   │   │   └── Validation/      # Validators
│   │   └── pom.xml
│   │
│   └── sqlitedb/                # SQLite database
│       └── importer.sqlite
│
└── README.md
```

## 🚀 Kurulum

### Gereksinimler
- **Java 21** veya üzeri
- **Node.js 16+** ve npm
- **Maven 3.8+**
- **Git**

### Backend Kurulumu

```bash
# Proje dizinine git
cd stajkabul/import/import

# Bağımlılıkları yükle ve derle
mvn clean install

# Uygulamayı başlat
mvn spring-boot:run
```

Backend varsayılan olarak **http://localhost:8080** adresinde çalışır.

### Frontend Kurulumu

```bash
# Frontend dizinine git
cd stajkabul/grispi-frontend

# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm start
```

Frontend varsayılan olarak **http://localhost:3000** adresinde çalışır.

### Production Build

```bash
# Frontend production build
cd stajkabul/grispi-frontend
npm run build

# Backend JAR dosyası oluştur
cd stajkabul/import/import
mvn clean package
```

## 📖 Kullanım

### 1️⃣ Dosya Yükleme
- "Dosya Seç" butonuna tıklayın
- Excel (.xlsx) dosyanızı seçin
- Import türünü seçin (User, Ticket, CustomField)

### 2️⃣ Veri Önizleme
- Yüklenen dosyanın ilk 5 satırı otomatik görüntülenir
- Sütun başlıkları ve örnek veriler kontrol edilir
- "Devam Et" ile sonraki adıma geçin

### 3️⃣ Alan Eşleştirme (Mapping)
- Excel sütunlarını Grispi alanlarıyla eşleştirin
- Eşleştirme şablonunu kaydedebilirsiniz

### 4️⃣ Özet Kontrolü
- Eşleştirilen alanları gözden geçirin
- Toplam kayıt sayısını kontrol edin
- Son kontrolleri yapın

### 5️⃣ Import Sonucu
- Sistem verileri doğrular ve kaydeder
- Başarılı/başarısız kayıtlar raporlanır
- Hata detayları ve satır numaraları gösterilir
- Sonuçları CSV olarak indirebilirsiniz

## 🌐 API Dokümantasyonu

### Base URL
```
http://localhost:8080
```

### Endpoints

#### Excel İşlemleri
```http
# Excel önizleme
POST /api/import/excel/preview
Content-Type: multipart/form-data
Body: file (Excel file)

# Excel import (mapping ile)
POST /api/import/{type}/import-excel
Content-Type: multipart/form-data
Body: file, mappings (JSON)
```

#### Kullanıcı İşlemleri
```http
# Kullanıcı doğrulama
POST /api/users/validate
Content-Type: application/json
Body: User[]

# Kullanıcı import
POST /api/users/import
Content-Type: application/json
Body: User[]

# Mapping ile import
POST /api/users/import-mapped
Content-Type: application/json
Body: UserImportRequest
```

#### Ticket İşlemleri
```http
# Ticket doğrulama
POST /api/tickets/validate

# Ticket import
POST /api/tickets/import

# Mapping ile import
POST /api/tickets/import-mapped
```

#### CustomField İşlemleri
```http
# CustomField import
POST /api/custom-fields/import
```

### Veri Modelleri

#### User (Kullanıcı)
```json
{
  "externalId": "string",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "phone": "string (E.164 format: +90XXXXXXXXXX)",
  "emails": ["string"],
  "organization": "Organization ID",
  "groups": ["Group names"],
  "language": "TR|EN|DE",
  "role": "ADMIN|AGENT|CUSTOMER",
  "tags": ["string"],
  "enabled": true
}
```

#### Ticket 
```json
{
  "externalId": "string",
  "subject": "string (required, min: 3)",
  "description": "string (required)",
  "creator": "User ID (required)",
  "requester": "User ID (required)",
  "assignee": "User ID",
  "assigneeGroup": "Group name",
  "organization": "Organization ID",
  "status": "enum",
  "channel": "enum",
  "type": "enum",
  "priority": "enum",
  "tags": ["string"],
  "createdAt": "ISO 8601 date",
  "updatedAt": "ISO 8601 date",
  "solvedAt": "ISO 8601 date"
}
```

### Validasyon Kuralları

#### User Validasyonu
- `firstName` ve `lastName` zorunlu
- `phone` E.164 formatında (+90XXXXXXXXXX)
- `emails` geçerli email formatında
- `role` geçerli enum değeri (ADMIN, CUSTOMER)

#### Organization Validasyonu
- `name` zorunlu ve boş olamaz
- `externalId` unique olmalı

#### Ticket Validasyonu
- `subject` minimum 3 karakter
- `description` zorunlu
- `creator` ve `requester` zorunlu ve geçerli User ID

### Response Formatı

#### Başarılı Response
```json
{
  "success": true,
  "totalRecords": 100,
  "successCount": 95,
  "errorCount": 5,
  "errors": [
    {
      "rowNumber": 3,
      "field": "email",
      "message": "Invalid email format",
      "value": "invalid-email"
    }
  ]
}
```

#### Hata Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## 📸 Ekran Görüntüleri

> **Not**: Proje demo videosu için [buraya tıklayın](https://1drv.ms/f/c/ce2939c88c9e94d8/EkATqyn1-kNGqklUTOMajYEBF2sv42sPhnwPe-hTZmmpEw?e=9IRnb0)

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!
