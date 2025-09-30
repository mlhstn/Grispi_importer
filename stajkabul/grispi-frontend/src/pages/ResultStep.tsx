import React, { useState } from 'react';
import { Card, Typography, Button, Space, message, Modal, Row, Col, Statistic, Table, Tag, Collapse } from 'antd';
import { CopyOutlined, DownloadOutlined, UploadOutlined, FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { translateErrorMessage } from '../utils/errorTranslator';
import { MappingField, ImportType } from '../types';
import { apiService } from '../services/api';

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
  excelFile?: File; // Excel dosyasını da al
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
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  const { t } = useTranslation();
  const [importing, setImporting] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

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

  const handleImportToBackend = async () => {
    setImporting(true);
    try {
      const response = await apiService.importWithMapping(mappingResult);

      if (response.success) {
        message.success(`${importType} ${t('result.importSuccess')}` as any);
        setImportModalVisible(false);
      } else {
        message.error(`Import error: ${response.error}`);
      }
    } catch (error) {
      message.error(t('result.backendConnectionFailed') as any);
    } finally {
      setImporting(false);
    }
  };

  const handleImportExcelToDatabase = async () => {
    if (!excelFile) {
      message.error(t('result.excelFileNotFound') as any);
      return;
    }

    console.log('Import başlatılıyor...', { importType, mappings, excelFile });
    setImporting(true);
    
    try {
      const response = await apiService.importExcelWithMapping(excelFile, importType, mappings);
      console.log('API response:', response);

      if (response.success) {
        setImportResult(response.data || response);
        message.success(`${importType} ${t('result.importSuccess')}` as any);
        setImportModalVisible(false);
      } else {
        message.error(`${t('result.importError')} ${response.error}` as any);
      }
    } catch (error) {
      console.error('Import error:', error);
      message.error(t('result.importFailed') + (error instanceof Error ? error.message : 'Unknown error') as any);
    } finally {
      setImporting(false);
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
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title={translations.totalRecords}
                value={importResult.totalRecords}
                valueStyle={{ color: '#10b981' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={translations.successful}
                value={importResult.successCount}
                valueStyle={{ color: '#10b981' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={translations.failed}
                value={importResult.errorCount}
                valueStyle={{ color: '#ef4444' }}
              />
            </Col>
            <Col span={6}>
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
        <Col xs={24} sm={8}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
            <Statistic
              title={translations.importType}
              value={importType}
              prefix={<FileTextOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0', fontSize: '16px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
            <Statistic
              title={translations.totalColumns}
              value={totalRows}
              prefix={<CheckCircleOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
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
          <Space>
            <Button 
              icon={<CopyOutlined />} 
              onClick={handleCopy}
              size="small"
              style={{ borderRadius: '6px' }}
            >
              {translations.copy}
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleDownload}
              size="small"
              style={{ borderRadius: '6px' }}
            >
              {translations.download}
            </Button>
            <Button 
              type="primary"
              icon={<UploadOutlined />} 
              onClick={() => setImportModalVisible(true)}
              size="small"
              style={{ 
                backgroundColor: '#9b51e0',
                borderColor: '#9b51e0',
                borderRadius: '6px'
              }}
            >
              {excelFile ? translations.sendToGrispi : translations.sendToBackend}
            </Button>
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

      {/* Navigation Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid #e5e7eb',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        gap: window.innerWidth < 768 ? '16px' : '0'
      }}>
        <Button 
          icon={<LeftOutlined />}
          onClick={onPrevious}
          size={window.innerWidth < 768 ? 'middle' : 'large'}
          style={{
            borderRadius: '8px',
            height: window.innerWidth < 768 ? '36px' : '40px',
            paddingLeft: window.innerWidth < 768 ? '16px' : '20px',
            paddingRight: window.innerWidth < 768 ? '16px' : '20px',
            width: window.innerWidth < 768 ? '100%' : 'auto'
          }}
        >
          {translations.previous}
        </Button>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: '#6b7280',
          fontSize: window.innerWidth < 768 ? '12px' : '14px',
          order: window.innerWidth < 768 ? -1 : 0
        }}>
          <span>{translations.step} {currentStep + 1} {translations.of} {totalSteps}</span>
        </div>
        
        <Button 
          onClick={onReset} 
          size={window.innerWidth < 768 ? 'middle' : 'large'}
          style={{
            borderColor: '#d1d5db',
            color: '#6b7280',
            borderRadius: '8px',
            height: window.innerWidth < 768 ? '36px' : '40px',
            paddingLeft: window.innerWidth < 768 ? '16px' : '20px',
            paddingRight: window.innerWidth < 768 ? '16px' : '20px',
            width: window.innerWidth < 768 ? '100%' : 'auto'
          }}
        >
          {translations.startNewImport}
        </Button>
      </div>

      {/* Success Info */}
      <Card 
        style={{ 
          marginTop: '24px', 
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
            backgroundColor: '#10b981' 
          }} />
          <Text style={{ color: '#065f46', fontSize: '14px' }}>
            {translations.importCompletedMessage}
          </Text>
        </div>
      </Card>

      {/* Backend Import Modal */}
      <Modal
        title={excelFile ? translations.modalTitle : translations.modalTitleBackend}
        open={importModalVisible}
        onOk={() => {
          console.log('Modal OK clicked');
          if (excelFile) {
            handleImportExcelToDatabase();
          } else {
            handleImportToBackend();
          }
        }}
        onCancel={() => setImportModalVisible(false)}
        confirmLoading={importing}
        okText={excelFile ? translations.sendToGrispi : translations.send}
        cancelText={translations.cancel}
        okButtonProps={{
          style: {
            backgroundColor: '#9b51e0',
            borderColor: '#9b51e0'
          }
        }}
      >
        <p>
          {excelFile ? (
            <>
              <Text strong>{importType}</Text> {translations.modalMessage}
            </>
          ) : (
            <>
              <Text strong>{importType}</Text> {translations.modalMessageBackend}
            </>
          )}
        </p>
        <p>
          <Text type="secondary">
            {translations.modalFooter}
          </Text>
        </p>
      </Modal>
    </div>
  );
};

export default ResultStep; 