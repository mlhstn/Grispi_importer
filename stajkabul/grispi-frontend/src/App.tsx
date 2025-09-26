import React, { useState } from 'react';
import { Steps, Layout, Typography, Menu, Avatar, Dropdown, Space } from 'antd';
import { 
  UploadOutlined, 
  EyeOutlined, 
  LinkOutlined, 
  CheckCircleOutlined, 
  FileTextOutlined,
  MenuOutlined,
  DashboardOutlined,
  PlusOutlined,
  UserOutlined,
  SendOutlined,
  BarChartOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import UploadStep from './pages/UploadStep';
import DataPreviewStep from './pages/DataPreviewStep';
import MappingStep from './pages/MappingStep';
import SummaryStep from './pages/SummaryStep';
import ResultStep from './pages/ResultStep';
import { ExcelData, ImportType, MappingField } from './types';
import { parseExcel } from './utils/parseExcel';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const { Step } = Steps;

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportType>('User');
  const [mappings, setMappings] = useState<MappingField[]>([]);

  const handleFileUpload = async (file: File, type: ImportType) => {
    try {
      const data = await parseExcel(file);
      setExcelData(data);
      setExcelFile(file);
      setImportType(type);
      setCurrentStep(1);
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
    }
  };

  const handleMappingComplete = (mappingFields: MappingField[]) => {
    setMappings(mappingFields);
    setCurrentStep(3);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setExcelData(null);
    setExcelFile(null);
    setMappings([]);
  };

  const handleContinueToMapping = () => {
    setCurrentStep(2);
  };

  const handleContinueToResult = () => {
    setCurrentStep(4);
  };

  const steps = [
    {
      title: 'Upload',
      icon: <UploadOutlined />,
      content: <UploadStep 
        onFileUpload={handleFileUpload} 
        onNext={() => setCurrentStep(1)}
        onPrevious={() => setCurrentStep(0)}
        currentStep={currentStep}
        totalSteps={5}
      />
    },
    {
      title: 'Preview',
      icon: <EyeOutlined />,
      content: excelData ? (
        <DataPreviewStep 
          data={excelData} 
          onContinue={handleContinueToMapping}
          onNext={() => setCurrentStep(2)}
          onPrevious={() => setCurrentStep(0)}
          currentStep={currentStep}
          totalSteps={5}
        />
      ) : null
    },
    {
      title: 'Mapping',
      icon: <LinkOutlined />,
      content: excelData ? (
        <MappingStep 
          data={excelData} 
          importType={importType} 
          onMappingComplete={handleMappingComplete}
          onNext={() => setCurrentStep(3)}
          onPrevious={() => setCurrentStep(1)}
          currentStep={currentStep}
          totalSteps={5}
        />
      ) : null
    },
    {
      title: 'Summary',
      icon: <CheckCircleOutlined />,
      content: <SummaryStep 
        importType={importType} 
        mappings={mappings} 
        totalRows={excelData?.headers.length || 0}
        onContinue={handleContinueToResult}
        onNext={() => setCurrentStep(4)}
        onPrevious={() => setCurrentStep(2)}
        currentStep={currentStep}
        totalSteps={5}
      />
    },
    {
      title: 'Result',
      icon: <FileTextOutlined />,
      content: <ResultStep 
        importType={importType} 
        mappings={mappings} 
        totalRows={excelData?.headers.length || 0} 
        onReset={handleReset}
        excelFile={excelFile || undefined}
        onNext={() => setCurrentStep(0)}
        onPrevious={() => setCurrentStep(3)}
        currentStep={currentStep}
        totalSteps={5}
      />
    }
  ];

  const sidebarMenuItems = [
    {
      key: 'getting-started',
      icon: <div style={{ fontSize: '12px', fontWeight: 'bold' }}>1/11</div>,
      label: 'Getting Started',
      children: []
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      children: []
    },
    {
      key: 'create',
      icon: <PlusOutlined />,
      label: 'Create',
      children: []
    },
    {
      key: 'contacts',
      icon: <UserOutlined />,
      label: 'Contacts',
      children: []
    },
    {
      key: 'send',
      icon: <SendOutlined />,
      label: 'Send',
      children: []
    },
    {
      key: 'insights',
      icon: <BarChartOutlined />,
      label: 'Insights',
      children: []
    }
  ];



  const userMenu = (
    <Menu>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="settings">Settings</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        width={250} 
        style={{ 
          background: 'var(--grispi-sidebar-bg)',
          borderRight: '1px solid var(--grispi-sidebar-border)'
        }}
      >
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid var(--grispi-sidebar-border)' 
        }}>
          <Title level={4} className="grispi-sidebar-text" style={{ margin: 0 }}>
            Grispi Import
          </Title>
        </div>
        
        <Menu
          mode="inline"
          items={sidebarMenuItems}
          style={{ 
            background: 'var(--grispi-sidebar-bg)',
            border: 'none',
            color: 'var(--grispi-text-white)'
          }}
          theme="dark"
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ 
          background: 'var(--grispi-bg-primary)', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--grispi-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MenuOutlined className="grispi-mor-text" style={{ fontSize: '18px', marginRight: '16px' }} />
            <Title level={4} style={{ margin: 0, color: 'var(--grispi-text-primary)' }}>
              Import Contacts
            </Title>
          </div>
          
          <Space size="large">
            <QuestionCircleOutlined style={{ fontSize: '18px', color: 'var(--grispi-text-secondary)' }} />
            <BellOutlined style={{ fontSize: '18px', color: 'var(--grispi-text-secondary)' }} />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserSwitchOutlined />} />
                <span style={{ color: 'var(--grispi-text-secondary)' }}>Username</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        {/* Content */}
        <Content style={{ 
          padding: '24px', 
          background: 'var(--grispi-bg-secondary)',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Steps */}
            <div style={{ 
              background: 'var(--grispi-bg-primary)', 
              padding: '24px', 
              borderRadius: '12px', 
              marginBottom: '24px',
              boxShadow: '0 2px 8px var(--grispi-shadow-card)'
            }}>
              <Steps 
                current={currentStep} 
                style={{ marginBottom: 0 }}
                progressDot
              >
                {steps.map((step, index) => (
                  <Step 
                    key={index} 
                    title={step.title} 
                    icon={step.icon}
                    disabled={index === 1 && !excelData}
                  />
                ))}
              </Steps>
            </div>
            
            {/* Main Content */}
            <div style={{ 
              background: 'var(--grispi-bg-primary)', 
              padding: '32px', 
              borderRadius: '12px',
              boxShadow: '0 2px 8px var(--grispi-shadow-card)',
              minHeight: '500px'
            }}>
              {steps[currentStep].content}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
