import React from 'react';
import { Row, Col, Select, Typography, Card, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import { GrispiField } from '../types';

const { Text } = Typography;
const { Option } = Select;

interface MappingRowProps {
  excelColumn: string;
  grispiFields: GrispiField[];
  selectedField: string;
  onFieldChange: (value: string) => void;
  requiredFields?: Record<string, any>;
}

const MappingRow: React.FC<MappingRowProps> = ({
  excelColumn,
  grispiFields,
  selectedField,
  onFieldChange,
  requiredFields = {}
}) => {


  return (
    <Card 
      size="small" 
      style={{ 
        marginBottom: 16, 
        border: selectedField ? '1px solid #d1fae5' : '1px solid #e5e7eb',
        backgroundColor: selectedField ? '#f0fdf4' : '#ffffff',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      hoverable
    >
      <Row gutter={24} align="middle" style={{ minHeight: '60px' }}>
        <Col span={10}>
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ fontSize: '15px', color: '#1f2937' }}>
                {excelColumn}
              </Text>
              {requiredFields[excelColumn]?.required && (
                <Tag color="red">Required</Tag>
              )}
            </div>
          </div>
        </Col>
        <Col span={2} style={{ textAlign: 'center' }}>
          <ArrowRightOutlined 
            style={{ 
              color: '#9b51e0', 
              fontSize: '16px',
              fontWeight: 'bold'
            }} 
          />
        </Col>
        <Col span={12}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select Grispi field..."
            value={selectedField}
            onChange={onFieldChange}
            allowClear
            size="large"
            optionLabelProp="label"
            showSearch
            filterOption={(input, option) =>
              String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {grispiFields.map((field) => (
              <Option 
                key={field.value} 
                value={field.value}
                label={field.label}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '4px 0'
                }}>
                  <Text style={{ fontWeight: 500, fontSize: '14px' }}>
                    {field.label}
                  </Text>
                </div>
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Card>
  );
};

export default MappingRow; 