import React from 'react';
import { Row, Col, Select, Typography, Card, Tag } from 'antd';

import { GrispiField } from '../types';

const { Text } = Typography;
const { Option } = Select;

interface MappingRowProps {
  excelColumn: string;
  sampleData: string[];
  grispiFields: GrispiField[];
  selectedField: string;
  onFieldChange: (value: string) => void;
  requiredFields?: Record<string, any>;
}

const MappingRow: React.FC<MappingRowProps> = ({
  excelColumn,
  sampleData,
  grispiFields,
  selectedField,
  onFieldChange,
  requiredFields = {}
}) => {


  return (
    <Card 
      size="small" 
      style={{ 
        marginBottom: 12, 
        border: selectedField ? '1px solid #d1fae5' : '1px solid #e5e7eb',
        backgroundColor: selectedField ? '#f0fdf4' : '#ffffff',
        borderRadius: '8px',
        transition: 'all 0.2s ease'
      }}
    >
      <Row gutter={24} align="middle">
        <Col span={10}>
          <div style={{ padding: '4px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Text strong style={{ fontSize: '14px', color: '#1f2937' }}>
                {excelColumn}
              </Text>
            </div>
            <div style={{ marginTop: 6 }}>
              <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                Örnek: {sampleData.slice(0, 2).filter(data => data).join(', ') || 'Veri yok'}
              </Text>
            </div>
          </div>
        </Col>
        <Col span={2} style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '24px', 
            height: '2px', 
            backgroundColor: '#9b51e0', 
            borderRadius: '1px',
            margin: '0 auto'
          }} />
        </Col>
        <Col span={12}>
          <Select
            style={{ width: '100%' }}
            placeholder="Grispi alanı seçin..."
            value={selectedField}
            onChange={onFieldChange}
            allowClear
            size="middle"
            optionLabelProp="label"
          >
            {grispiFields.map((field) => (
              <Option 
                key={field.value} 
                value={field.value}
                label={field.label}
              >
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '2px',
                  padding: '2px 0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px'
                  }}>
                    <Text style={{ fontWeight: 500, fontSize: '13px' }}>
                      {field.label}
                    </Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: '11px', lineHeight: '1.2' }}>
                    Tip: {field.type}
                  </Text>
                  {field.description && (
                    <Text type="secondary" style={{ fontSize: '10px', lineHeight: '1.2', color: '#666' }}>
                      {field.description}
                    </Text>
                  )}
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