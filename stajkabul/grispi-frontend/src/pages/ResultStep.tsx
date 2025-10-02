import React, { useState } from 'react';
import { Card, Typography, Button, Space, message, Modal, Row, Col, Statistic, Table, Tag, Collapse, Input, Form } from 'antd';
import { CopyOutlined, DownloadOutlined, UploadOutlined, FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translateErrorMessage } from '../utils/errorTranslator';
import { MappingField, ImportType, ExcelData } from '../types';
import { apiService } from '../services/api';
import { generateMappedCSV, csvToFile } from '../utils/csvGenerator';

interface ErrorDetail {
  rowNumber: number;
  originalData: Record<string, any>;
  errors: string[];
}

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface ResultStepProps {
  importType: ImportType;
  mappings: MappingField[];
  totalRows: number;
  onReset: () => void;
  excelFile?: File;
  excelData?: ExcelData; // Excel data (headers ve rows)
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const ResultStep: React.FC<ResultStepProps> = ({ 
  importType, 
  mappings, 
  totalRows, 
  onReset,
  excelFile,
  excelData,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  const { t } = useTranslation();
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [grispiModalVisible, setGrispiModalVisible] = useState(false);
  const [tenantId, setTenantId] = useState('help');
  const [subject, setSubject] = useState(`${importType} Import Dosyası`);
  const [grispiTicketId, setGrispiTicketId] = useState<string | null>(null);

  // Translation strings
  const translations = {
    totalRecords: t('result.totalRecords'),
    successful: t('result.successful'),
    failed: t('result.failed'),
    successRate: t('result.successRate'),
    importType: t('result.importType'),
    totalColumns: t('result.totalColumns'),
    mappedFields: t('result.mappedFields'),
    rowNo: t('result.rowNo'),
    originalData: t('result.originalData'),
    errorMessages: t('result.errorMessages'),
    errorDetails: t('result.errorDetails'),
    showFailedRecords: t('result.showFailedRecords'),
    jsonConfiguration: t('result.jsonConfiguration'),
    copy: t('result.copy'),
    download: t('result.download'),
    sendToGrispi: t('result.sendToGrispi'),
    sendToBackend: t('result.sendToBackend'),
    previous: t('result.previous'),
    startNewImport: t('result.startNewImport'),
    step: t('result.step'),
    of: t('result.of'),
    importCompletedMessage: t('result.importCompletedMessage'),
    modalTitle: t('result.modalTitle'),
    modalTitleBackend: t('result.modalTitleBackend'),
    modalMessage: t('result.modalMessage'),
    modalMessageBackend: t('result.modalMessageBackend'),
    modalFooter: t('result.modalFooter', { mappedFields: mappings.length, totalColumns: totalRows }),
    send: t('result.send'),
    cancel: t('result.cancel'),
    row: t('errors.row')
  };

  // Hata mesajlarını çeviren fonksiyon
  const translateErrors = (errors: string[]): string[] => {
    return errors.map(error => translateErrorMessage(error, t));
  };

  const mappingResult = {
    importType,
    mappings,
    totalRows,
    mappedFields: mappings.length,
    timestamp: new Date().toISOString()
  };

  const jsonString = JSON.stringify(mappingResult, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      message.success(t('result.copySuccess') as any);
    }).catch(() => {
      message.error(t('result.copyFailed') as any);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grispi-mapping-${importType.toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success(t('result.downloadSuccess') as any);
  };

  const handleReset = () => {
    setGrispiTicketId(null);
    setImportResult(null);
    onReset();
  };

  const handleSendToGrispi = async () => {
    if (!excelData || !excelFile) {
      message.error('Excel verisi bulunamadı');
      return;
    }

    if (!tenantId.trim()) {
      message.error('Tenant ID boş olamaz');
      return;
    }

    if (!subject.trim()) {
      message.error('Subject boş olamaz');
      return;
    }

    setImporting(true);
    
    try {
      // 1. Önce backend'e gönder - validasyon yap
      const importResponse = await apiService.importExcelWithMapping(excelFile, importType, mappings);
      
      if (!importResponse.success) {
        message.error(`Validasyon hatası: ${importResponse.error}`);
        setImporting(false);
        return;
      }

      // 2. Validasyon sonuçlarını kaydet
      const validationResult = importResponse.data;
      setImportResult(validationResult);
      
      // 3. Başarılı kayıtların CSV'sini oluştur
      const csvContent = generateMappedCSV(excelData.headers, excelData.rows, mappings);
      const csvFile = csvToFile(csvContent, `${importType.toLowerCase()}-import-${Date.now()}.csv`);
      
      // 4. HTML body oluştur (sonuçlarla birlikte)
      const htmlBody = `
        <div style="font-family: Arial, sans-serif;">
          <h3>Import Dosyası</h3>
          <p><strong>Import Türü:</strong> ${importType}</p>
          <p><strong>Toplam Satır:</strong> ${validationResult.totalRecords}</p>
          <p><strong>Başarılı:</strong> <span style="color: green;">${validationResult.successCount}</span></p>
          <p><strong>Başarısız:</strong> <span style="color: red;">${validationResult.errorCount}</span></p>
          <p><strong>Başarı Oranı:</strong> ${validationResult.totalRecords > 0 ? Math.round((validationResult.successCount / validationResult.totalRecords) * 100) : 0}%</p>
          <p><strong>Maplenen Alan Sayısı:</strong> ${mappings.length}</p>
          <hr/>
          <p>CSV dosyası (tüm kayıtlar) ektedir.</p>
        </div>
      `;
      
      // 5. Grispi'ye gönder
      const grispiResponse = await apiService.uploadToGrispi(csvFile, tenantId, subject, htmlBody);
      
      if (grispiResponse.success) {
        const ticketId = grispiResponse.data?.key || grispiResponse.data || 'Bilinmiyor';
        setGrispiTicketId(ticketId);
        message.success(`Grispi'ye başarıyla gönderildi! Ticket ID: ${ticketId}`);
      } else {
        message.error(`Grispi gönderimi başarısız: ${grispiResponse.error}`);
      }
    } catch (error) {
      console.error('Grispi upload error:', error);
      message.error('İşlem sırasında hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setImporting(false);
      setGrispiModalVisible(false);
    }
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '32px',
        padding: '0 8px'
      }}>
        <Title level={2} style={{ 
          color: '#1f2937', 
          marginBottom: '8px',
          fontSize: window.innerWidth < 768 ? '24px' : '32px'
        }}>
{t('result.title')}
        </Title>
        <Text type="secondary" style={{ 
          fontSize: window.innerWidth < 768 ? '14px' : '16px',
          lineHeight: '1.5'
        }}>
{t('result.subtitle')}
        </Text>
      </div>

      {/* Grispi Ticket ID Display */}
      {grispiTicketId && (
        <Card 
          style={{ 
            marginBottom: '24px', 
            border: '2px solid #9b51e0',
            backgroundColor: '#f5f3ff',
            borderRadius: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#9b51e0' }} />
              <div>
                <Text strong style={{ color: '#6b21a8', display: 'block', fontSize: '16px' }}>
                  ✅ Grispi'ye Başarıyla Gönderildi!
                </Text>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  Ticket ID: <Text strong copyable style={{ color: '#9b51e0' }}>{grispiTicketId}</Text>
                </Text>
              </div>
            </div>
            <Button
              type="link"
              icon={<FileTextOutlined />}
              href={`https://${tenantId}.grispi.com/tickets/${grispiTicketId}`}
              target="_blank"
              style={{ color: '#9b51e0' }}
            >
              Ticket'ı Görüntüle
            </Button>
          </div>
        </Card>
      )}

      {/* Import Result Display */}
      {importResult && (
        <Card 
          style={{ 
            marginBottom: '24px', 
            border: '1px solid #d1fae5',
            backgroundColor: '#f0fdf4',
            borderRadius: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#10b981' 
            }} />
            <Text strong style={{ color: '#065f46' }}>
{t('result.importCompleted')}
            </Text>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={translations.totalRecords}
                value={importResult.totalRecords}
                valueStyle={{ color: '#10b981' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={translations.successful}
                value={importResult.successCount}
                valueStyle={{ color: '#10b981' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={translations.failed}
                value={importResult.errorCount}
                valueStyle={{ color: '#ef4444' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={translations.successRate}
                value={importResult.totalRecords > 0 ? Math.round((importResult.successCount / importResult.totalRecords) * 100) : 0}
                suffix="%"
                valueStyle={{ color: '#10b981' }}
              />
            </Col>
          </Row>
        </Card>
      )}

                {/* Error Details */}
      {importResult && importResult.errorCount > 0 && (
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ExclamationCircleOutlined style={{ color: '#ef4444' }} />
              <span>{translations.errorDetails} ({importResult.errorCount} {translations.totalRecords.toLowerCase()})</span>
            </div>
          }
          style={{ 
            marginBottom: '24px', 
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
            borderRadius: '12px'
          }}
        >
          <Collapse 
            ghost 
            style={{ backgroundColor: 'transparent' }}
            expandIconPosition="end"
          >
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text strong style={{ color: '#dc2626' }}>
                    {translations.showFailedRecords}
                  </Text>
                  <Tag color="red">{importResult.errorCount}</Tag>
                </div>
              } 
              key="1"
            >
                             <Table<ErrorDetail>
                 dataSource={importResult.errors || []}
                 pagination={{ pageSize: 10 }}
                 size="small"
                 scroll={{ x: true }}
                columns={[
                  {
                    title: translations.rowNo,
                    dataIndex: 'rowNumber',
                    key: 'rowNumber',
                    width: 80,
                    render: (rowNumber) => (
                      <Tag color="red">{translations.row} {rowNumber}</Tag>
                    )
                  },

                  {
                    title: translations.originalData,
                    dataIndex: 'originalData',
                    key: 'originalData',
                    render: (originalData) => (
                      <div style={{ maxWidth: '300px' }}>
                        {originalData && Object.entries(originalData).map(([key, value]) => (
                          <div key={key} style={{ marginBottom: '4px' }}>
                            <Text strong style={{ fontSize: '11px', color: '#6b7280' }}>
                              {key}:
                            </Text>
                            <Text style={{ fontSize: '11px', marginLeft: '4px' }}>
                              {String(value || '')}
                            </Text>
                          </div>
                        ))}
                      </div>
                    )
                  },
                  {
                    title: translations.errorMessages,
                    dataIndex: 'errors',
                    key: 'errors',
                    render: (errors) => {
                      console.log('Error data received:', errors);
                      return (
                        <div>
                          {errors && translateErrors(errors).map((error: string, index: number) => (
                            <Tag 
                              key={index} 
                              color="red" 
                              style={{ marginBottom: '4px', fontSize: '11px' }}
                            >
                              {error}
                            </Tag>
                          ))}
                        </div>
                      );
                    }
                  }
                ]}
                rowKey={(record) => `${record.rowNumber}`}
              />
            </Panel>
          </Collapse>
        </Card>
      )}

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
            <Statistic
              title={translations.importType}
              value={importType}
              prefix={<FileTextOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0', fontSize: '16px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
            <Statistic
              title={translations.totalColumns}
              value={totalRows}
              prefix={<CheckCircleOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
            <Statistic
              title={translations.mappedFields}
              value={mappings.length}
              prefix={<CheckCircleOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
      </Row>

      {/* JSON Output */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined style={{ color: '#9b51e0' }} />
            <span>{translations.jsonConfiguration}</span>
          </div>
        }
        extra={
          <Space 
            direction={window.innerWidth < 768 ? 'vertical' : 'horizontal'}
            style={{ width: window.innerWidth < 768 ? '100%' : 'auto' }}
          >
            <Button 
              icon={<CopyOutlined />} 
              onClick={handleCopy}
              size="small"
              style={{ 
                borderRadius: '6px',
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }}
            >
              {translations.copy}
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleDownload}
              size="small"
              style={{ 
                borderRadius: '6px',
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }}
            >
              {translations.download}
            </Button>
            {excelData && (
              <Button 
                type="primary"
                icon={<UploadOutlined />} 
                onClick={() => setGrispiModalVisible(true)}
                size="small"
                style={{ 
                  backgroundColor: '#10b981',
                  borderColor: '#10b981',
                  borderRadius: '6px',
                  width: window.innerWidth < 768 ? '100%' : 'auto'
                }}
              >
                Grispi'ye Gönder
              </Button>
            )}
          </Space>
        }
        style={{ border: '1px solid #e5e7eb', marginBottom: '24px', borderRadius: '12px' }}
      >
        <pre 
          style={{ 
            backgroundColor: '#f8fafc', 
            padding: '16px', 
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '400px',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px solid #e2e8f0'
          }}
        >
          {jsonString}
        </pre>
      </Card>

      {/* Success Info */}
      <Card 
        style={{ 
          marginBottom: '24px', 
          border: '1px solid #d1fae5',
          backgroundColor: '#f0fdf4',
          borderRadius: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#10b981',
            flexShrink: 0
          }} />
          <Text style={{ color: '#065f46', fontSize: '14px', lineHeight: '1.6' }}>
            {translations.importCompletedMessage}
          </Text>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '20px 0',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        gap: window.innerWidth < 768 ? '16px' : '0'
      }}>
        <Button 
          icon={<LeftOutlined />}
          onClick={onPrevious}
          size="large"
          style={{
            borderRadius: '8px',
            height: '44px',
            paddingLeft: '24px',
            paddingRight: '24px',
            width: window.innerWidth < 768 ? '100%' : 'auto',
            fontWeight: 500
          }}
        >
          {translations.previous}
        </Button>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: '#6b7280',
          fontSize: '15px',
          fontWeight: 500,
          order: window.innerWidth < 768 ? -1 : 0
        }}>
          <span>{translations.step} {currentStep + 1} {translations.of} {totalSteps}</span>
        </div>
        
        <Button 
          onClick={handleReset} 
          size="large"
          style={{
            borderColor: '#d1d5db',
            color: '#6b7280',
            borderRadius: '8px',
            height: '44px',
            paddingLeft: '24px',
            paddingRight: '24px',
            width: window.innerWidth < 768 ? '100%' : 'auto',
            fontWeight: 500
          }}
        >
          {translations.startNewImport}
        </Button>
      </div>

      {/* Grispi Upload Modal */}
      <Modal
        title="Grispi'ye Gönder"
        open={grispiModalVisible}
        onOk={handleSendToGrispi}
        onCancel={() => setGrispiModalVisible(false)}
        confirmLoading={importing}
        okText="Gönder"
        cancelText="İptal"
        okButtonProps={{
          style: {
            backgroundColor: '#10b981',
            borderColor: '#10b981'
          }
        }}
        width={window.innerWidth < 768 ? '90%' : 500}
        centered
        style={{ maxWidth: window.innerWidth < 768 ? 'calc(100vw - 32px)' : '500px' }}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary" style={{ fontSize: window.innerWidth < 768 ? '13px' : '14px' }}>
            CSV dosyası oluşturulup Grispi API'sine ticket olarak gönderilecek.
          </Text>
        </div>
        <Form layout="vertical">
          <Form.Item label="Tenant ID" required>
            <Input 
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="help"
              size={window.innerWidth < 768 ? 'middle' : 'large'}
            />
          </Form.Item>
          <Form.Item label="Ticket Subject" required>
            <Input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={`${importType} Import Dosyası`}
              size={window.innerWidth < 768 ? 'middle' : 'large'}
            />
          </Form.Item>
        </Form>
        <div style={{ 
          marginTop: '16px', 
          padding: window.innerWidth < 768 ? '10px' : '12px', 
          backgroundColor: '#f0fdf4', 
          borderRadius: '8px', 
          border: '1px solid #d1fae5' 
        }}>
          <Text strong style={{ color: '#065f46', fontSize: window.innerWidth < 768 ? '13px' : '14px' }}>
            Özet:
          </Text>
          <div style={{ marginTop: '8px' }}>
            <Text style={{ fontSize: window.innerWidth < 768 ? '12px' : '13px', color: '#065f46' }}>
              • Toplam Satır: {excelData?.rows.length || 0}<br/>
              • Maplenen Alan: {mappings.length}<br/>
              • Import Türü: {importType}
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResultStep; 