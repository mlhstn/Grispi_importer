import React from 'react';
import { Card, Typography, Row, Col, Statistic, List, Tag, Button } from 'antd';
import { MappingField, ImportType } from '../types';
import { CheckCircleOutlined, ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface SummaryStepProps {
  importType: ImportType;
  mappings: MappingField[];
  totalRows: number;
  onContinue?: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ 
  importType, 
  mappings, 
  totalRows,
  onContinue
}) => {
  const mappedFields = mappings.length;
  const unmappedFields = totalRows - mappedFields;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#1f2937', marginBottom: '8px' }}>
          Mapping Summary
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Review your field mappings before proceeding
        </Text>
      </div>
      
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
              value={mappedFields}
              prefix={<CheckCircleOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <Statistic
              title="Unmapped Fields"
              value={unmappedFields}
              prefix={<CheckCircleOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Mapping Details */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircleOutlined style={{ color: '#9b51e0' }} />
            <span>Mapping Details</span>
          </div>
        }
        style={{ border: '1px solid #e5e7eb', marginBottom: '24px', borderRadius: '12px' }}
      >
        <List
          dataSource={mappings}
          renderItem={(mapping) => (
            <List.Item>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ color: '#1f2937' }}>{mapping.excelColumn}</Text>

                </div>
                <div style={{ textAlign: 'right' }}>
                  <Tag color="blue" style={{ marginRight: '8px' }}>→</Tag>
                  <Text strong style={{ color: '#9b51e0' }}>{mapping.grispiField}</Text>
                </div>
              </div>
            </List.Item>
          )}
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
          Continue to Result
        </Button>
      </div>

      {/* Info Card */}
      <Card 
        style={{ 
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
            {mappedFields > 0 
              ? `Mapping completed successfully! ${mappedFields} fields mapped. Click "Continue to Result" to see the final output.`
              : 'No fields have been mapped. Please go back to the mapping step to configure field mappings.'
            }
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default SummaryStep; 