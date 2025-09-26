import React from 'react';
import { Table, Card, Typography, Tag, Row, Col, Statistic, Button } from 'antd';
import { FileTextOutlined, BarChartOutlined, EyeOutlined, ArrowRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
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
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#1f2937', marginBottom: '8px' }}>
          Data Preview
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Review your data before mapping
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <Statistic
              title="Total Rows"
              value={data.rows.length}
              prefix={<BarChartOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <Statistic
              title="Total Columns"
              value={data.headers.length}
              prefix={<FileTextOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <Statistic
              title="Preview Rows"
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
            <span>Data Preview (First 5 rows)</span>
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
        borderTop: '1px solid #e5e7eb'
      }}>
        <Button 
          icon={<LeftOutlined />}
          onClick={onPrevious}
          size="large"
          style={{
            borderRadius: '8px',
            height: '40px',
            paddingLeft: '20px',
            paddingRight: '20px'
          }}
        >
          Previous
        </Button>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <span>Step {currentStep + 1} of {totalSteps}</span>
        </div>
        
        <Button 
          type="primary"
          icon={<RightOutlined />}
          onClick={onNext}
          size="large"
          style={{
            borderRadius: '8px',
            height: '40px',
            paddingLeft: '20px',
            paddingRight: '20px',
            backgroundColor: '#9b51e0',
            borderColor: '#9b51e0'
          }}
        >
          Next
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
            Showing first 5 rows of {data.rows.length} total rows. 
            Use the navigation buttons to proceed to field mapping.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default DataPreviewStep; 