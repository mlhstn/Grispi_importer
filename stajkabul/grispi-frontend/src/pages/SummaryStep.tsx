import React from 'react';
import { Card, Typography, Row, Col, Statistic, List, Tag, Button } from 'antd';
import { MappingField, ImportType } from '../types';
import { CheckCircleOutlined, ArrowRightOutlined, FileTextOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface SummaryStepProps {
  importType: ImportType;
  mappings: MappingField[];
  totalRows: number;
  onContinue?: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ 
  importType, 
  mappings, 
  totalRows,
  onContinue,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
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
              ? `Mapping completed successfully! ${mappedFields} fields mapped. Use the navigation buttons to proceed to the final result.`
              : 'No fields have been mapped. Please go back to the mapping step to configure field mappings.'
            }
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default SummaryStep; 