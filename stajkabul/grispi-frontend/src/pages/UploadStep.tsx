import React, { useState } from 'react';
import { Upload, Select, Card, Typography, message, Button, Space } from 'antd';
import { InboxOutlined, CloudUploadOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ImportType } from '../types';
import { apiService } from '../services/api';
import { useTranslation } from 'react-i18next';

const { Dragger } = Upload;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

interface UploadStepProps {
  onFileUpload: (file: File, importType: ImportType) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const UploadStep: React.FC<UploadStepProps> = ({ onFileUpload, onNext, onPrevious, currentStep, totalSteps }) => {
  const { t } = useTranslation();
  const [importType, setImportType] = useState<ImportType>('User');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const isCSV = file.type === 'text/csv';
    
    if (!isExcel && !isCSV) {
      message.error(t('upload.errorFileType'));
      return false;
    }

    setSelectedFile(file);
    setLoading(true);
    
    try {
      const response = await apiService.previewExcel(file);
      if (response.success) {
        message.success(t('upload.success'));
        onFileUpload(file, importType);
      } else {
        message.error(`${t('upload.backendError')}: ${response.error}`);
      }
    } catch (error) {
      message.error(t('upload.backendFailed'));
      onFileUpload(file, importType);
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  return (
    <div style={{ 
      maxWidth: 800, 
      margin: '0 auto',
      padding: '0 16px'
    }}>
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
          {t('upload.title')}
        </Title>
        <Text type="secondary" style={{ 
          fontSize: window.innerWidth < 768 ? '14px' : '16px',
          lineHeight: '1.5'
        }}>
          {t('upload.subtitle')}
        </Text>
      </div>

      {/* Import Type Selection */}
      <Card 
        style={{ 
          marginBottom: '24px', 
          border: '1px solid #e5e7eb',
          borderRadius: '12px'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ color: '#1f2937', fontSize: '16px' }}>
            {t('upload.importType')}
          </Text>
        </div>
        <Select
          value={importType}
          onChange={setImportType}
          style={{ width: '100%' }}
          size="large"
        >
          <Option value="User">{t('importTypes.user')}</Option>
          <Option value="Ticket">{t('importTypes.ticket')}</Option>
          <Option value="CustomField">{t('importTypes.customField')}</Option>
        </Select>
      </Card>

      {/* Upload Area */}
      <Card 
        style={{ 
          marginBottom: '24px', 
          border: '1px solid #e5e7eb',
          borderRadius: '12px'
        }}
      >
        <Dragger
          name="file"
          multiple={false}
          beforeUpload={handleFileUpload}
          accept=".xlsx,.csv"
          disabled={loading}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: '#9b51e0', fontSize: '48px' }} />
          </p>
          <p className="ant-upload-text" style={{ fontSize: '18px', color: '#1f2937' }}>
            {t('upload.dragDrop')}
          </p>
          <p className="ant-upload-hint" style={{ color: '#6b7280' }}>
            {t('upload.support')}
          </p>
        </Dragger>
      </Card>

      {/* Selected File Info */}
      {selectedFile && (
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
              backgroundColor: '#10b981' 
            }} />
            <div>
              <Text strong style={{ color: '#065f46' }}>
                {t('upload.fileSelected')}: {selectedFile.name}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('upload.size')}: {(selectedFile.size / 1024).toFixed(2)} KB
              </Text>
            </div>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card 
        style={{ 
          border: '1px solid #e9d5ff',
          backgroundColor: '#faf5ff',
          borderRadius: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#9b51e0' 
          }} />
          <div>
            <Text style={{ color: '#581c87', fontSize: '14px' }}>
              <strong>{t('upload.instructions')}</strong> {t('upload.instructionsText')}
            </Text>
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '20px 0',
        marginTop: '8px',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        gap: window.innerWidth < 768 ? '16px' : '0'
      }}>
        <Button 
          icon={<LeftOutlined />}
          onClick={onPrevious}
          disabled={currentStep === 0}
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
          {t('navigation.previous')}
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
          <span>{t('navigation.step')} {currentStep + 1} {t('navigation.of')} {totalSteps}</span>
        </div>
        
        <Button 
          type="primary"
          icon={<RightOutlined />}
          iconPosition="end"
          onClick={onNext}
          disabled={!selectedFile}
          size="large"
          style={{
            borderRadius: '8px',
            height: '44px',
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundColor: '#9b51e0',
            borderColor: '#9b51e0',
            width: window.innerWidth < 768 ? '100%' : 'auto',
            fontWeight: 500
          }}
        >
          {t('navigation.next')}
        </Button>
      </div>
    </div>
  );
};

export default UploadStep; 