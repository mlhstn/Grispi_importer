import React, { useState } from 'react';
import { Card, Typography, Button, Space, message, Modal, Row, Col, Statistic, Table, Tag, Collapse } from 'antd';
import { CopyOutlined, DownloadOutlined, UploadOutlined, FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
}

const ResultStep: React.FC<ResultStepProps> = ({ 
  importType, 
  mappings, 
  totalRows, 
  onReset,
  excelFile 
}) => {
  const [importing, setImporting] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

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
      message.success('JSON copied!');
    }).catch(() => {
      message.error('Copy failed!');
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
    message.success('JSON file downloaded!');
  };

  const handleImportToBackend = async () => {
    setImporting(true);
    try {
      const response = await apiService.importWithMapping(mappingResult);

      if (response.success) {
        message.success(`${importType} mapping data successfully sent to backend!`);
        setImportModalVisible(false);
      } else {
        message.error(`Import error: ${response.error}`);
      }
    } catch (error) {
      message.error('Backend connection failed!');
    } finally {
      setImporting(false);
    }
  };

  const handleImportExcelToDatabase = async () => {
    if (!excelFile) {
      message.error('Excel dosyası bulunamadı!');
      return;
    }

    console.log('Import başlatılıyor...', { importType, mappings, excelFile });
    setImporting(true);
    
    try {
      const response = await apiService.importExcelWithMapping(excelFile, importType, mappings);
      console.log('API response:', response);

      if (response.success) {
        setImportResult(response.data || response);
        message.success(`${importType} data successfully saved to database!`);
        setImportModalVisible(false);
      } else {
        message.error(`Excel import error: ${response.error}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      message.error('Excel import failed! Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#1f2937', marginBottom: '8px' }}>
          Import Result
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Your mapping configuration is ready
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
              Import Completed!
            </Text>
          </div>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Total Records"
                value={importResult.totalRecords}
                valueStyle={{ color: '#10b981' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Successful"
                value={importResult.successCount}
                valueStyle={{ color: '#10b981' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Failed"
                value={importResult.errorCount}
                valueStyle={{ color: '#ef4444' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Success Rate"
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
              <span>Error Details ({importResult.errorCount} records)</span>
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
                    Show Failed Records
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
                    title: 'Row No',
                    dataIndex: 'rowNumber',
                    key: 'rowNumber',
                    width: 80,
                    render: (rowNumber) => (
                      <Tag color="red">Row {rowNumber}</Tag>
                    )
                  },

                  {
                    title: 'Original Data',
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
                    title: 'Error Messages',
                    dataIndex: 'errors',
                    key: 'errors',
                    render: (errors) => {
                      console.log('Error data received:', errors);
                      return (
                        <div>
                          {errors && errors.map((error: string, index: number) => (
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
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <Statistic
              title="Import Type"
              value={importType}
              prefix={<FileTextOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0', fontSize: '16px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <Statistic
              title="Total Columns"
              value={totalRows}
              prefix={<CheckCircleOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <Statistic
              title="Mapped Fields"
              value={mappings.length}
              prefix={<CheckCircleOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <Statistic
              title="Success Rate"
              value={totalRows > 0 ? Math.round((mappings.length / totalRows) * 100) : 0}
              suffix="%"
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
            <span>JSON Configuration</span>
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
              Copy
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleDownload}
              size="small"
              style={{ borderRadius: '6px' }}
            >
              Download
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
              {excelFile ? 'Import to Database' : 'Send to Backend'}
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

      {/* Action Buttons */}
      <div style={{ textAlign: 'center' }}>
        <Space size="large">
          <Button 
            onClick={onReset} 
            size="large"
            style={{
              borderColor: '#d1d5db',
              color: '#6b7280',
              borderRadius: '8px',
              padding: '0 32px',
              height: '48px',
              fontSize: '16px'
            }}
          >
            Start New Import
          </Button>
        </Space>
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
            Import process completed successfully! You can copy the JSON configuration, download it as a file, or send it to the backend for processing.
          </Text>
        </div>
      </Card>

      {/* Backend Import Modal */}
      <Modal
        title={excelFile ? "Import to Database" : "Send to Backend"}
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
        okText={excelFile ? "Import" : "Send"}
        cancelText="Cancel"
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
              <Text strong>{importType}</Text> Excel data will be saved to database according to mapping configuration.
            </>
          ) : (
            <>
              <Text strong>{importType}</Text> mapping configuration will be sent to the backend for processing.
            </>
          )}
        </p>
        <p>
          <Text type="secondary">
            Total {mappings.length} fields mapped and {totalRows} columns configured.
          </Text>
        </p>
      </Modal>
    </div>
  );
};

export default ResultStep; 