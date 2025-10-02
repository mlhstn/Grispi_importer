# Katkıda Bulunma Rehberi

Bu projeye katkıda bulunmak istediğiniz için teşekkürler! 🎉

## Katkı Süreci

### 1. Fork ve Clone
```bash
# Projeyi fork edin (GitHub üzerinden)
# Forkladığınız projeyi clone edin
git clone https://github.com/KULLANICI_ADI/grispi-staj.git
cd grispi-staj
```

### 2. Branch Oluşturma
```bash
# Feature branch oluşturun
git checkout -b feature/yeni-ozellik

# veya bug fix için
git checkout -b fix/hata-duzeltmesi
```

### 3. Değişikliklerinizi Yapın
- Kod standartlarına uyun
- Clean code prensiplerini takip edin
- Gerekli testleri ekleyin

### 4. Commit
```bash
# Conventional Commits formatında commit yapın
git commit -m "feat: yeni özellik eklendi"
git commit -m "fix: hata düzeltildi"
git commit -m "docs: dokümantasyon güncellendi"
```

### Commit Mesaj Formatı
```
<tip>: <açıklama>

[opsiyonel gövde]

[opsiyonel footer]
```

**Tipler:**
- `feat`: Yeni özellik
- `fix`: Hata düzeltme
- `docs`: Dokümantasyon
- `style`: Kod formatı
- `refactor`: Kod yeniden yapılandırma
- `test`: Test ekleme/düzeltme
- `chore`: Diğer değişiklikler

### 5. Push ve Pull Request
```bash
# Değişiklikleri push edin
git push origin feature/yeni-ozellik

# GitHub üzerinden Pull Request oluşturun
```

## Kod Standartları

### Backend (Java)
- Java Code Conventions
- Spring Boot best practices
- SOLID prensipleri
- JavaDoc yorumları

### Frontend (TypeScript/React)
- ESLint kuralları
- React best practices
- TypeScript strict mode
- JSDoc yorumları

## Test Yazma

### Backend Test
```java
@Test
public void testUserValidation() {
    // Test kodu
}
```

### Frontend Test
```typescript
describe('Component', () => {
  it('should render correctly', () => {
    // Test kodu
  });
});
```

## Pull Request Checklist

- [ ] Kod çalışıyor
- [ ] Testler başarılı
- [ ] Dokümantasyon güncellendi
- [ ] Commit mesajları doğru formatta
- [ ] Kod review için hazır

## Sorularınız mı var?

Issue açarak sorularınızı sorabilirsiniz.

## Code of Conduct

- Saygılı olun
- Yapıcı eleştiri yapın
- Yardımcı olun
- Öğrenmeye açık olun

Katkılarınız için teşekkürler! 🙏

