/**
 * Grispi Ticket API Configuration
 * Import tamamlandığında CSV'yi Grispi API'sine göndermek için kullanılır
 */

export interface GrispiTicketConfig {
  apiUrl: string;
  tenantId: string;
  formId: number;
  userEmail: string;
  userName: string;
  subject: string;
  commentBodyTemplate: string;
}

/**
 * Varsayılan Grispi ticket config
 */
export const DEFAULT_GRISPI_CONFIG: GrispiTicketConfig = {
  apiUrl: 'https://api.grispi.com/user-forms/tickets',
  tenantId: 'help',
  formId: 14,
  userEmail: 'team+import@grispi.com',
  userName: 'Grispi Import User',
  subject: 'Import',
  commentBodyTemplate: '<p>Import Dosyası</p>'
};

/**
 * Import tipine göre özelleştirilmiş subject oluştur
 */
export const generateSubject = (importType: string, tenantId?: string): string => {
  if (tenantId) {
    return `${tenantId} - ${importType} Import`;
  }
  return `${importType} Import`;
};

/**
 * Import bilgilerine göre HTML comment body oluştur
 */
export const generateCommentBody = (
  importType: string,
  totalRows: number,
  mappedFields: number,
  timestamp: string
): string => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb; border-radius: 8px;">
      <h2 style="color: #9b51e0; margin-bottom: 16px;">📊 Import Dosyası</h2>
      
      <div style="background: white; padding: 16px; border-radius: 6px; margin-bottom: 12px;">
        <p style="margin: 8px 0;"><strong>Import Tipi:</strong> ${importType}</p>
        <p style="margin: 8px 0;"><strong>Toplam Satır:</strong> ${totalRows}</p>
        <p style="margin: 8px 0;"><strong>Eşleştirilen Alan:</strong> ${mappedFields}</p>
        <p style="margin: 8px 0;"><strong>Tarih:</strong> ${new Date(timestamp).toLocaleString('tr-TR')}</p>
      </div>
      
      <p style="color: #6b7280; font-size: 12px; margin-top: 16px;">
        Bu dosya Grispi Import Portal tarafından otomatik olarak oluşturulmuştur.
      </p>
    </div>
  `;
};

/**
 * Grispi ticket payload oluştur
 */
export const createTicketPayload = (
  config: GrispiTicketConfig,
  importType: string,
  totalRows: number,
  mappedFields: number,
  timestamp: string
): string => {
  const subject = generateSubject(importType, config.tenantId);
  const commentBody = generateCommentBody(importType, totalRows, mappedFields, timestamp);
  
  return JSON.stringify({
    fields: [
      {
        key: 'ts.subject',
        value: subject
      },
      {
        key: 'ts.form',
        value: config.formId
      },
      {
        key: 'ts.untrusted_end_user',
        value: `:${config.userEmail}:`
      }
    ],
    comment: {
      body: commentBody,
      channel: 'USER_FORM',
      creator: [
        {
          key: 'us.email',
          value: config.userEmail
        },
        {
          key: 'us.full_name',
          value: config.userName
        }
      ],
      publicVisible: false
    },
    currentAttachments: {
      inlineImages: [],
      attachments: []
    }
  });
};
