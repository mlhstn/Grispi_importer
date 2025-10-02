import React from 'react';
import { Card, Typography, Row, Col, Statistic, List, Tag, Button } from 'antd';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const mappedFields = mappings.length;
  const unmappedFields = totalRows - mappedFields;

  // Translation strings
  const translations = {
    title: t('summary.title'),
    subtitle: t('summary.subtitle'),
    importType: t('summary.importType'),
    totalColumns: t('summary.totalColumns'),
    mappedFields: t('summary.mappedFields'),
    unmappedFields: t('summary.unmappedFields'),
    mappingDetails: t('summary.mappingDetails'),
    excelColumn: t('summary.excelColumn'),
    grispiField: t('summary.grispiField'),
    previous: t('summary.previous'),
    next: t('summary.next'),
    step: t('summary.step'),
    of: t('summary.of')
  };

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
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
            <Statistic
              title={translations.importType}
              value={importType}
              prefix={<FileTextOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0', fontSize: '16px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
            <Statistic
              title={translations.totalColumns}
              value={totalRows}
              prefix={<CheckCircleOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
            <Statistic
              title={translations.mappedFields}
              value={mappedFields}
              prefix={<CheckCircleOutlined style={{ color: '#9b51e0' }} />}
              valueStyle={{ color: '#9b51e0' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
            <Statistic
              title={translations.unmappedFields}
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
            <span>{translations.mappingDetails}</span>
          </div>
        }
        style={{ border: '1px solid #e5e7eb', marginBottom: '24px', borderRadius: '12px' }}
      >
        <List
          dataSource={mappings}
          renderItem={(mapping) => (
            <List.Item 
              style={{ 
                padding: '16px 0',
                borderBottom: '1px solid #f0f0f0',
                marginBottom: '8px'
              }}
            >
              <div style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ flex: 1 }}>
                  <Text strong style={{ 
                    color: '#1f2937', 
                    fontSize: '15px',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    {mapping.excelColumn}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {translations.excelColumn}
                  </Text>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  margin: '0 20px' 
                }}>
                  <ArrowRightOutlined 
                    style={{ 
                      color: '#9b51e0', 
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }} 
                  />
                </div>
                
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <Text strong style={{ 
                    color: '#9b51e0', 
                    fontSize: '15px',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    {mapping.grispiField}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {translations.grispiField}
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* Info Card */}
      <Card 
        style={{ 
          border: '1px solid #d1fae5',
          backgroundColor: '#f0fdf4',
          borderRadius: '12px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#10b981',
            flexShrink: 0
          }} />
          <Text style={{ color: '#065f46', fontSize: '14px', lineHeight: '1.6' }}>
            {mappedFields > 0 
              ? t('summary.mappingCompleted', { mappedFields })
              : t('summary.noFieldsMapped')
            }
          </Text>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '20px 0',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        gap: window.innerWidth < 768 ? '16px' : '0'
      }}>
        <Button 
          icon={<LeftOutlined />}
          onClick={onPrevious}
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
          {translations.previous}
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
          <span>{translations.step} {currentStep + 1} {translations.of} {totalSteps}</span>
        </div>
        
        <Button 
          type="primary"
          icon={<RightOutlined />}
          iconPosition="end"
          onClick={onNext}
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
          {translations.next}
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep; 