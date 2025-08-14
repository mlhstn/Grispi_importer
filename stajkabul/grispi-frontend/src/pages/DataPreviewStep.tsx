import React from 'react';
import { Table, Card, Typography, Tag, Row, Col, Statistic, Button } from 'antd';
import { FileTextOutlined, BarChartOutlined, EyeOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { ExcelData } from '../types';

const { Title, Text } = Typography;

interface DataPreviewStepProps {
  data: ExcelData;
  onContinue?: () => void;
}

const DataPreviewStep: React.FC<DataPreviewStepProps> = ({ data, onContinue }) => {
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

      {/* Continue Button */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Button 
          type="primary" 
          size="large" 
          onClick={onContinue}
          icon={<ArrowRightOutlined />}
          style={{
            backgroundColor: '#9b51e0',
            borderColor: '#9b51e0',
            borderRadius: '8px',
            padding: '0 32px',
            height: '48px',
            fontSize: '16px'
          }}
        >
          Continue to Mapping
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
            Click "Continue to Mapping" to configure field mappings for your data.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default DataPreviewStep; 