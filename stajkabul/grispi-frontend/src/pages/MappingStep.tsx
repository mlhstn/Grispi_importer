import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, message, Row, Col, Statistic, Modal, Input, List, Tag, Tooltip } from 'antd';
import { LinkOutlined, ArrowRightOutlined, CheckCircleOutlined, BookOutlined, StarOutlined, DeleteOutlined, EditOutlined, SaveOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ExcelData, GrispiField, MappingField } from '../types';
import MappingRow from '../components/MappingRow';
import { GRISPI_FIELDS } from '../types';
import { apiService } from '../services/api';

const { Title, Text } = Typography;

interface MappingStepProps {
  data: ExcelData;
  importType: string;
  onMappingComplete: (mappings: MappingField[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const MappingStep: React.FC<MappingStepProps> = ({ 
  data, 
  importType, 
  onMappingComplete,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [mappedCount, setMappedCount] = useState(0);
  const [templates, setTemplates] = useState<any[]>([]);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [saveTemplateModalVisible, setSaveTemplateModalVisible] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiredFields, setRequiredFields] = useState<Record<string, any>>({});
  const grispiFields = GRISPI_FIELDS[importType as keyof typeof GRISPI_FIELDS] || [];

      // Calculate mapping status of required fields
  const requiredFieldMappings = Object.entries(requiredFields)
    .filter(([fieldName, fieldInfo]) => fieldInfo.required)
    .map(([fieldName]) => fieldName);

  const mappedRequiredFields = Object.values(mappings)
    .filter(grispiField => grispiField !== '' && requiredFieldMappings.includes(grispiField));

  const requiredFieldsProgress = requiredFieldMappings.length > 0 
    ? (mappedRequiredFields.length / requiredFieldMappings.length) * 100 
    : 0;

  console.log('MappingStep - importType:', importType);
  console.log('MappingStep - grispiFields:', grispiFields);
  console.log('MappingStep - data headers:', data.headers);

  useEffect(() => {
    // Initialize mappings with empty values
    const initialMappings: Record<string, string> = {};
    data.headers.forEach((header: string) => {
      initialMappings[header] = '';
    });
    setMappings(initialMappings);
  }, [data.headers]);

  useEffect(() => {
    // Count mapped fields
    const count = Object.values(mappings).filter(value => value !== '').length;
    setMappedCount(count);
  }, [mappings]);

  // Load templates and required fields on component mount
  useEffect(() => {
    loadTemplates();
    loadRequiredFields();
  }, [importType]);

  const loadTemplates = async () => {
    try {
      const response = await apiService.getMappingTemplates(importType);
      if (response.success) {
        setTemplates(response.data.templates || []);
      }
    } catch (error) {
      console.error('Templates yüklenirken hata:', error);
    }
  };

  const loadRequiredFields = async () => {
    try {
      const response = await apiService.getRequiredFields(importType);
      if (response.success) {
        setRequiredFields(response.data.requiredFields || {});
      }
    } catch (error) {
      console.error('Error loading required fields:', error);
    }
  };

  const handleLoadTemplate = async (templateId: number) => {
    try {
      setLoading(true);
      const response = await apiService.getTemplateById(templateId);
      if (response.success) {
        const templateMappings = response.data.mappings;
        const newMappings: Record<string, string> = {};
        
        templateMappings.forEach((mapping: any) => {
          newMappings[mapping.excelColumn] = mapping.grispiField;
        });
        
        setMappings(newMappings);
        setTemplateModalVisible(false);
        message.success('Şablon başarıyla yüklendi!');
      }
    } catch (error) {
      message.error('Şablon yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      message.error('Şablon adı gerekli!');
      return;
    }

    try {
      setLoading(true);
             const mappedFields = Object.entries(mappings)
         .filter(([_, grispiField]) => grispiField !== '')
         .map(([excelColumn, grispiField]) => ({
           excelColumn,
           grispiField
         }));

      const templateData = {
        name: templateName,
        importType: importType,
        description: templateDescription,
        mappings: mappedFields,
        createdBy: 'user' // Gerçek uygulamada kullanıcı bilgisi
      };

      const response = await apiService.saveMappingTemplate(templateData);
      if (response.success) {
        message.success('Şablon başarıyla kaydedildi!');
        setSaveTemplateModalVisible(false);
        setTemplateName('');
        setTemplateDescription('');
        loadTemplates(); // Şablonları yeniden yükle
      }
    } catch (error) {
      message.error('Şablon kaydedilirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      const response = await apiService.deleteTemplate(templateId);
      if (response.success) {
        message.success('Şablon silindi!');
        loadTemplates();
      }
    } catch (error) {
      message.error('Şablon silinirken hata oluştu!');
    }
  };

  const handleSetAsDefault = async (templateId: number) => {
    try {
      const response = await apiService.setTemplateAsDefault(templateId);
      if (response.success) {
        message.success('Şablon varsayılan olarak ayarlandı!');
        loadTemplates();
      }
    } catch (error) {
      message.error('Şablon ayarlanırken hata oluştu!');
    }
  };

  const handleFieldChange = (excelColumn: string, grispiField: string) => {
    setMappings(prev => ({
      ...prev,
      [excelColumn]: grispiField
    }));
  };



     const handleContinue = () => {
     const mappedFields = Object.entries(mappings)
       .filter(([_, grispiField]) => grispiField !== '')
       .map(([excelColumn, grispiField]) => {
         return {
           excelColumn,
           grispiField
         };
       });

    if (mappedFields.length === 0) {
      message.warning('You need to map at least one field!');
      return;
    }

    // Validation check - check if required fields are mapped
    const requiredFieldMappings = Object.entries(requiredFields)
      .filter(([fieldName, fieldInfo]) => fieldInfo.required)
      .map(([fieldName]) => fieldName);

    const mappedRequiredFields = mappedFields
      .map(field => field.grispiField)
      .filter(field => requiredFieldMappings.includes(field));

    const missingRequiredFields = requiredFieldMappings.filter(
      requiredField => !mappedRequiredFields.includes(requiredField)
    );

    if (missingRequiredFields.length > 0) {
      const missingFieldLabels = missingRequiredFields.map(fieldName => 
        grispiFields.find(f => f.value === fieldName)?.label || fieldName
      );
      
      message.error(
        `Required fields missing: ${missingFieldLabels.join(', ')}. ` +
        'Please map all required fields.'
      );
      return;
    }

    onMappingComplete(mappedFields);
  };




  return (
    <div>
             <div style={{ textAlign: 'center', marginBottom: '32px' }}>
         <Title level={2} style={{ color: '#1f2937', marginBottom: '8px' }}>
           Field Mapping
         </Title>
         <Text type="secondary" style={{ fontSize: '16px' }}>
           Map your Excel columns to Grispi fields
         </Text>
       </div>

      

             {/* Statistics Cards */}
             <Row gutter={16} style={{ marginBottom: '24px' }}>
         <Col span={6}>
           <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
             <Statistic
               title="Import Type"
               value={importType}
               prefix={<LinkOutlined style={{ color: '#9b51e0' }} />}
               valueStyle={{ color: '#9b51e0', fontSize: '16px' }}
             />
           </Card>
         </Col>
         <Col span={6}>
           <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
             <Statistic
               title="Total Columns"
               value={data.headers.length}
               prefix={<CheckCircleOutlined style={{ color: '#9b51e0' }} />}
               valueStyle={{ color: '#9b51e0' }}
             />
           </Card>
         </Col>
         <Col span={6}>
           <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
             <Statistic
               title="Mapped Fields"
               value={mappedCount}
               prefix={<ArrowRightOutlined style={{ color: '#9b51e0' }} />}
               valueStyle={{ color: '#9b51e0' }}
             />
           </Card>
         </Col>
         <Col span={6}>
           <Card style={{ textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: '12px', height: '120px' }}>
             <Statistic
               title="Required Fields"
               value={`${mappedRequiredFields.length}/${requiredFieldMappings.length}`}
               prefix={<CheckCircleOutlined style={{ color: requiredFieldsProgress === 100 ? '#10b981' : '#f59e0b' }} />}
               valueStyle={{ color: requiredFieldsProgress === 100 ? '#10b981' : '#f59e0b' }}
             />
           </Card>
         </Col>
       </Row>

       {/* Template Actions */}
      <Card 
        style={{ 
          marginBottom: '24px', 
          border: '1px solid #e9d5ff',
          backgroundColor: '#faf5ff',
          borderRadius: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#9b51e0' 
            }} />
            <Text style={{ color: '#581c87', fontSize: '14px' }}>
              Select the appropriate Grispi field for each Excel column. 
              You can save and load mapping templates for future use.
            </Text>
          </div>
          <Space>
            <Button 
              icon={<BookOutlined />} 
              onClick={() => setTemplateModalVisible(true)}
              disabled={templates.length === 0}
            >
              Load Template ({templates.length})
            </Button>
            <Button 
              type="primary"
              icon={<SaveOutlined />} 
              onClick={() => setSaveTemplateModalVisible(true)}
              disabled={mappedCount === 0}
              style={{ backgroundColor: '#9b51e0', borderColor: '#9b51e0' }}
            >
              Save Template
            </Button>
          </Space>
        </div>
      </Card>

      {/* Mapping Rows */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LinkOutlined style={{ color: '#9b51e0' }} />
            <span>Column Mappings</span>
          </div>
        }
        style={{ border: '1px solid #e5e7eb', marginBottom: '24px', borderRadius: '12px' }}
      >
        {data.headers.map((header: string) => (
          <MappingRow
            key={header}
            excelColumn={header}
            grispiFields={grispiFields}
            selectedField={mappings[header] || ''}
            onFieldChange={(value) => handleFieldChange(header, value)}
            requiredFields={requiredFields}
          />
        ))}
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
          onClick={handleContinue}
          disabled={mappedCount === 0 || (requiredFieldMappings.length > 0 && requiredFieldsProgress < 100)}
          size="large"
          style={{
            borderRadius: '8px',
            height: '40px',
            paddingLeft: '20px',
            paddingRight: '20px',
            backgroundColor: (requiredFieldMappings.length === 0 || requiredFieldsProgress === 100) ? '#9b51e0' : '#d1d5db',
            borderColor: (requiredFieldMappings.length === 0 || requiredFieldsProgress === 100) ? '#9b51e0' : '#d1d5db'
          }}
        >
          Next
        </Button>
      </div>

      {/* Progress Info */}
      {mappedCount > 0 && (
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
               {mappedCount} of {data.headers.length} fields mapped. 
               {mappedCount === data.headers.length ? ' All fields are mapped!' : ' Continue mapping or proceed to summary.'}

             </Text>
          </div>
        </Card>
      )}

      {/* Load Template Modal */}
      <Modal
        title="Load Mapping Template"
        open={templateModalVisible}
        onCancel={() => setTemplateModalVisible(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={templates}
          renderItem={(template) => (
            <List.Item
              actions={[
                <Button 
                  key="load" 
                  type="primary" 
                  size="small"
                  onClick={() => handleLoadTemplate(template.id)}
                  loading={loading}
                  style={{ backgroundColor: '#9b51e0', borderColor: '#9b51e0' }}
                >
                  Load
                </Button>,
                <Tooltip key="default" title={template.isDefault ? "Default Template" : "Set as Default"}>
                  <Button 
                    icon={<StarOutlined />} 
                    size="small"
                    type={template.isDefault ? "primary" : "default"}
                    onClick={() => handleSetAsDefault(template.id)}
                    style={template.isDefault ? { backgroundColor: '#f59e0b', borderColor: '#f59e0b' } : {}}
                  />
                </Tooltip>,
                <Button 
                  key="delete" 
                  icon={<DeleteOutlined />} 
                  size="small"
                  danger
                  onClick={() => handleDeleteTemplate(template.id)}
                />
              ]}
            >
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {template.name}
                    {template.isDefault && <Tag color="gold">Default</Tag>}
                  </div>
                }
                description={
                  <div>
                    <div>{template.description || 'No description'}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Created: {new Date(template.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Save Template Modal */}
      <Modal
        title="Save Mapping Template"
        open={saveTemplateModalVisible}
        onOk={handleSaveTemplate}
        onCancel={() => {
          setSaveTemplateModalVisible(false);
          setTemplateName('');
          setTemplateDescription('');
        }}
        confirmLoading={loading}
        okText="Save Template"
        cancelText="Cancel"
        okButtonProps={{
          style: { backgroundColor: '#9b51e0', borderColor: '#9b51e0' }
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Template Name *</Text>
          <Input
            placeholder="Enter template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            style={{ marginTop: '8px' }}
          />
        </div>
        <div>
          <Text strong>Description</Text>
          <Input.TextArea
            placeholder="Enter template description (optional)"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            rows={3}
            style={{ marginTop: '8px' }}
          />
        </div>
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
          <Text type="secondary">
            This template will save {mappedCount} mapped fields for {importType} import type.
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default MappingStep; 