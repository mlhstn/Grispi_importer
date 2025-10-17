import { TFunction } from 'i18next';

export interface ErrorTranslationMap {
  [key: string]: string;
}

// Backend hata mesajlarını frontend çeviri anahtarlarına eşleyen mapping
const ERROR_TRANSLATION_MAP: ErrorTranslationMap = {
  // External ID hataları
  'External ID already exists': 'errors.externalIdExists',
  'external ID already exists': 'errors.externalIdExists',
  'External ID already exists:': 'errors.externalIdExists',
  'external ID already exists:': 'errors.externalIdExists',
  
  // Email hataları
  'Email already exists': 'errors.emailExists',
  'email already exists': 'errors.emailExists',
  'Email address already exists': 'errors.emailExists',
  'email address already exists': 'errors.emailExists',
  'Invalid email address': 'errors.invalidEmail',
  'invalid email address': 'errors.invalidEmail',
  
  // Phone hataları
  'Phone already exists': 'errors.phoneExists',
  'phone already exists': 'errors.phoneExists',
  'Phone number already exists': 'errors.phoneExists',
  'phone number already exists': 'errors.phoneExists',
  'Invalid phone number': 'errors.invalidPhone',
  'invalid phone number': 'errors.invalidPhone',
  
  // Required field hataları
  'Required field missing': 'errors.requiredField',
  'required field missing': 'errors.requiredField',
  'Field is required': 'errors.requiredField',
  'field is required': 'errors.requiredField',
  
  // Duplicate record hataları
  'Duplicate record': 'errors.duplicateRecord',
  'duplicate record': 'errors.duplicateRecord',
  'Record already exists': 'errors.duplicateRecord',
  'record already exists': 'errors.duplicateRecord',
  
  // Validation hataları
  'Validation error': 'errors.validationError',
  'validation error': 'errors.validationError',
  'Validation failed': 'errors.validationError',
  'validation failed': 'errors.validationError',
  
  // Network hataları
  'Network error': 'errors.networkError',
  'network error': 'errors.networkError',
  'Connection failed': 'errors.networkError',
  'connection failed': 'errors.networkError',
  
  // Server hataları
  'Server error': 'errors.serverError',
  'server error': 'errors.serverError',
  'Internal server error': 'errors.serverError',
  'internal server error': 'errors.serverError',
  
  // Timeout hataları
  'Request timeout': 'errors.timeoutError',
  'request timeout': 'errors.timeoutError',
  'Timeout': 'errors.timeoutError',
  'timeout': 'errors.timeoutError',
  
  // File hataları
  'File not found': 'errors.fileNotFound',
  'file not found': 'errors.fileNotFound',
  'Invalid file type': 'errors.invalidFileType',
  'invalid file type': 'errors.invalidFileType',
  'File too large': 'errors.fileTooLarge',
  'file too large': 'errors.fileTooLarge',
  
  // Import/Export hataları
  'Import failed': 'errors.importFailed',
  'import failed': 'errors.importFailed',
  'Export failed': 'errors.exportFailed',
  'export failed': 'errors.exportFailed',
  
  // Permission hataları
  'Permission denied': 'errors.permissionDenied',
  'permission denied': 'errors.permissionDenied',
  'Unauthorized': 'errors.unauthorized',
  'unauthorized': 'errors.unauthorized',
  'Forbidden': 'errors.forbidden',
  'forbidden': 'errors.forbidden',
  
  // Required fields hataları
  'At least one of these fields is required: {fields}': 'errors.atLeastOneFieldRequired',
  'At least one of these fields is required': 'errors.atLeastOneFieldRequired',
  'at least one of these fields is required': 'errors.atLeastOneFieldRequired',
  'At least one field is required': 'errors.atLeastOneFieldRequired',
  'at least one field is required': 'errors.atLeastOneFieldRequired'
};

/**
 * Backend hata mesajını frontend çevirisine dönüştürür
 * @param errorMessage Backend'den gelen hata mesajı
 * @param t i18next çeviri fonksiyonu
 * @returns Çevrilmiş hata mesajı
 */
export const translateErrorMessage = (errorMessage: string, t: TFunction): string => {
  if (!errorMessage) return t('errors.unknownError');
  
  // Önce tam eşleşme ara
  const exactMatch = ERROR_TRANSLATION_MAP[errorMessage];
  if (exactMatch) {
    return t(exactMatch, { 
      externalId: extractValue(errorMessage, ':', 1),
      email: extractValue(errorMessage, ':', 1),
      phone: extractValue(errorMessage, ':', 1),
      field: extractValue(errorMessage, ':', 1),
      message: extractValue(errorMessage, ':', 1),
      fields: extractFieldsFromErrorMessage(errorMessage)
    });
  }
  
  // Kısmi eşleşme ara
  for (const [key, translationKey] of Object.entries(ERROR_TRANSLATION_MAP)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return t(translationKey, { 
        externalId: extractValue(errorMessage, ':', 1),
        email: extractValue(errorMessage, ':', 1),
        phone: extractValue(errorMessage, ':', 1),
        field: extractValue(errorMessage, ':', 1),
        message: extractValue(errorMessage, ':', 1),
        fields: extractFieldsFromErrorMessage(errorMessage)
      });
    }
  }
  
  // Hiçbir eşleşme bulunamazsa orijinal mesajı döndür
  return errorMessage;
};

/**
 * Hata mesajından değer çıkarır (örn: "External ID already exists: EXT008" -> "EXT008")
 * @param message Hata mesajı
 * @param separator Ayırıcı karakter
 * @param index Hangi parçayı alacağı (1: ikinci parça, 2: üçüncü parça, vb.)
 * @returns Çıkarılan değer
 */
const extractValue = (message: string, separator: string, index: number): string => {
  const parts = message.split(separator);
  return parts.length > index ? parts[index].trim() : '';
};

/**
 * "At least one of these fields is required" hata mesajından field listesini çıkarır
 * @param message Hata mesajı
 * @returns Field listesi string'i
 */
const extractFieldsFromErrorMessage = (message: string): string => {
  if (message.includes('At least one of these fields is required')) {
    return 'firstName, externalId, email, or phone';
  }
  return '';
};

/**
 * Birden fazla hata mesajını çevirir
 * @param errorMessages Hata mesajları dizisi
 * @param t i18next çeviri fonksiyonu
 * @returns Çevrilmiş hata mesajları dizisi
 */
export const translateErrorMessages = (errorMessages: string[], t: TFunction): string[] => {
  return errorMessages.map(error => translateErrorMessage(error, t));
};

/**
 * Hata mesajının çevrilebilir olup olmadığını kontrol eder
 * @param errorMessage Hata mesajı
 * @returns Çevrilebilir mi?
 */
export const isTranslatableError = (errorMessage: string): boolean => {
  if (!errorMessage) return false;
  
  // Tam eşleşme kontrolü
  if (ERROR_TRANSLATION_MAP[errorMessage]) return true;
  
  // Kısmi eşleşme kontrolü
  for (const key of Object.keys(ERROR_TRANSLATION_MAP)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return true;
    }
  }
  
  return false;
};
