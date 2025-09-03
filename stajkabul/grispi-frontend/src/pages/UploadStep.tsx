import React, { useState } from 'react';
import { Upload, Select, Card, Typography, message, Button } from 'antd';
import { InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { ImportType } from '../types';
import { apiService } from '../services/api';

const { Dragger } = Upload;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

interface UploadStepProps {
  onFileUpload: (file: File, importType: ImportType) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ onFileUpload }) => {
  const [importType, setImportType] = useState<ImportType>('User');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const isCSV = file.type === 'text/csv';
    
    if (!isExcel && !isCSV) {
      message.error('Sadece Excel (.xlsx) veya CSV dosyaları yükleyebilirsiniz!');
      return false;
    }

    setSelectedFile(file);
    setLoading(true);
    
    try {
      const response = await apiService.previewExcel(file);
      if (response.success) {
        message.success('Dosya başarıyla yüklendi!');
        onFileUpload(file, importType);
      } else {
        message.error(`Backend hatası: ${response.error}`);
      }
    } catch (error) {
              message.error('Backend connection failed! File will be processed locally.');
      onFileUpload(file, importType); // Fallback to local processing
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#1f2937', marginBottom: '8px' }}>
          Import Your Data
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
        Upload Excel or CSV files to import users, organizations, groups, tickets, or custom fields        </Text>
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
            Import Type
          </Text>
        </div>
        <Select
          value={importType}
          onChange={setImportType}
          style={{ width: '100%' }}
          size="large"
        >
         <Option value="User">👤 User</Option>
          <Option value="Organization">🏢 Organization</Option>
          <Option value="Group">👥 Group</Option>
          <Option value="Ticket">🎫 Ticket</Option>
          <Option value="CustomField">⚙️ Custom Field</Option>
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
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint" style={{ color: '#6b7280' }}>
            Support for Excel (.xlsx) and CSV files only
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
                File Selected: {selectedFile.name}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
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
              <strong>Instructions:</strong> Select your import type and upload an Excel or CSV file. 
              The system will automatically preview your data and guide you through the mapping process.
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadStep; 