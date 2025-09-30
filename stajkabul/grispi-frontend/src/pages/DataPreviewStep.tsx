import React from 'react';
import { Table, Card, Typography, Tag, Row, Col, Statistic, Button } from 'antd';
import { FileTextOutlined, BarChartOutlined, EyeOutlined, ArrowRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ExcelData } from '../types';

const { Title, Text } = Typography;

interface DataPreviewStepProps {
  data: ExcelData;
  onContinue?: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const DataPreviewStep: React.FC<DataPreviewStepProps> = ({ data, onContinue, onNext, onPrevious, currentStep, totalSteps }) => {
  const { t } = useTranslation();

  // Translation strings
  const translations = {
    title: t('preview.title'),
    subtitle: t('preview.subtitle'),
    totalRows: t('preview.totalRows'),
    totalColumns: t('preview.totalColumns'),
    previewRows: t('preview.previewRows'),
    dataPreview: t('preview.dataPreview'),
    firstRows: t('preview.firstRows'),
    previous: t('preview.previous'),
    next: t('preview.next'),
    step: t('preview.step'),
    of: t('preview.of'),
    showingRows: t('preview.showingRows'),
    useNavigationButtons: t('preview.useNavigationButtons')
  };

  const columns = data.headers.map((header: string, index: number) => ({
    title: header,
    dataIndex: index,
    key: index,
    render: (value: string) => (
      <div style={{ maxWidth: 200, wordBreak: 'break-word' }}>
        {value || '-'}
      </div>
    )
  }));

  const tableData = data.rows.slice(0, 5).map((row: string[], rowIndex: number) => {
    const rowData: any = { key: rowIndex };
    row.forEach((cell: string, cellIndex: number) => {
      rowData[cellIndex] = cell;
    });
    return rowData;
  });

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
          {translations.title}
        </Title>
        <Text type="secondary" style={{ 
          fontSize: window.innerWidth < 768 ? '14px' : '16px',
          lineHeight: '1.5'
        }}>
          {translations.subtitle}
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ 
            textAlign: 'center', 
            border: '1px solid #e5e7eb', 
            borderRadius: '12px',
            height: '120px'
          }}>
            <Statistic
              title={translations.totalRows}
              value={data.rows.length}
              prefix={<BarChartOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ 
            textAlign: 'center', 
            border: '1px solid #e5e7eb', 
            borderRadius: '12px',
            height: '120px'
          }}>
            <Statistic
              title={translations.totalColumns}
              value={data.headers.length}
              prefix={<FileTextOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ 
            textAlign: 'center', 
            border: '1px solid #e5e7eb', 
            borderRadius: '12px',
            height: '120px'
          }}>
            <Statistic
              title={translations.previewRows}
              value="5"
              prefix={<EyeOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Data Table */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined style={{ color: '#9b51e0' }} />
            <span>{translations.dataPreview} ({translations.firstRows.replace('{count}', '5')})</span>
          </div>
        }
        style={{ border: '1px solid #e5e7eb', marginBottom: '24px', borderRadius: '12px' }}
      >
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          scroll={{ x: 'max-content' }}
          size="middle"
          style={{ borderRadius: '8px' }}
        />
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
          type="primary"
          icon={<RightOutlined />}
          onClick={onNext}
          size={window.innerWidth < 768 ? 'middle' : 'large'}
          style={{
            borderRadius: '8px',
            height: window.innerWidth < 768 ? '36px' : '40px',
            paddingLeft: window.innerWidth < 768 ? '16px' : '20px',
            paddingRight: window.innerWidth < 768 ? '16px' : '20px',
            backgroundColor: '#9b51e0',
            borderColor: '#9b51e0',
            width: window.innerWidth < 768 ? '100%' : 'auto'
          }}
        >
          {translations.next}
        </Button>
      </div>

      {/* Info Card */}
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
          <Text style={{ color: '#581c87', fontSize: '14px' }}>
            {translations.showingRows.replace('{total}', data.rows.length.toString())} 
            {translations.useNavigationButtons}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default DataPreviewStep; 