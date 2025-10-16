import React, { useState } from 'react';
import { Steps, Layout, Typography, Menu, Avatar, Dropdown, Space, Button } from 'antd';
import './i18n/config';
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
  UserSwitchOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './hooks/useLanguage';
import { useBreakpoints } from './hooks/useMediaQuery';
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
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, supportedLanguages, getCurrentLanguageInfo } = useLanguage();
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useBreakpoints();
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
      title: t('steps.upload'),
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
      title: t('steps.preview'),
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
      title: t('steps.mapping'),
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
      title: t('steps.summary'),
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
      title: t('steps.result'),
      icon: <FileTextOutlined />,
      content: <ResultStep 
        importType={importType} 
        mappings={mappings} 
        totalRows={excelData?.headers.length || 0} 
        onReset={handleReset}
        excelFile={excelFile || undefined}
        excelData={excelData || undefined}
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
      label: t('menu.gettingStarted'),
      children: []
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: t('menu.dashboard'),
      children: []
    },
    {
      key: 'create',
      icon: <PlusOutlined />,
      label: t('menu.create'),
      children: []
    },
    {
      key: 'contacts',
      icon: <UserOutlined />,
      label: t('menu.contacts'),
      children: []
    },
    {
      key: 'send',
      icon: <SendOutlined />,
      label: t('menu.send'),
      children: []
    },
    {
      key: 'insights',
      icon: <BarChartOutlined />,
      label: t('menu.insights'),
      children: []
    }
  ];



  const userMenuItems = [
    {
      key: 'profile',
      label: t('menu.profile'),
    },
    {
      key: 'settings',
      label: t('menu.settings'),
    },
    {
      key: 'logout',
      label: t('menu.logout'),
    },
  ];

  const languageMenu = {
    items: supportedLanguages.map(language => ({
      key: language.code,
      label: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontWeight: language.code === currentLanguage ? 'bold' : 'normal'
        }}>
          <span>{language.nativeName}</span>
          {language.code === currentLanguage && <span style={{ color: '#9b51e0' }}>✓</span>}
        </div>
      ),
      onClick: () => changeLanguage(language.code)
    }))
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        width={isMobile ? 200 : isTablet ? 220 : 250}
        collapsedWidth={isMobile ? 0 : 80}
        breakpoint="md"
        collapsible={isMobile}
        style={{ 
          background: 'var(--grispi-sidebar-bg)',
          borderRight: '1px solid var(--grispi-sidebar-border)'
        }}
      >
        <div style={{ 
          padding: isMobile ? '16px' : '20px', 
          borderBottom: '1px solid var(--grispi-sidebar-border)' 
        }}>
          <Title 
            level={4} 
            className="grispi-sidebar-text" 
            style={{ 
              margin: 0,
              fontSize: isMobile ? '16px' : '18px'
            }}
          >
            {t('app.title')}
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
          padding: isMobile ? '0 16px' : '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--grispi-border)',
          height: isMobile ? '56px' : '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MenuOutlined 
              className="grispi-mor-text" 
              style={{ 
                fontSize: isMobile ? '16px' : '18px', 
                marginRight: isMobile ? '12px' : '16px' 
              }} 
            />
            <Title 
              level={4} 
              style={{ 
                margin: 0, 
                color: 'var(--grispi-text-primary)',
                fontSize: isMobile ? '16px' : '18px'
              }}
            >
              {t('app.importContacts')}
            </Title>
          </div>
          
          <Space size={isMobile ? 'middle' : 'large'}>
            {!isMobile && (
              <>
                <QuestionCircleOutlined style={{ fontSize: '18px', color: 'var(--grispi-text-secondary)' }} />
                <BellOutlined style={{ fontSize: '18px', color: 'var(--grispi-text-secondary)' }} />
              </>
            )}
            
            <Dropdown menu={languageMenu} placement="bottomRight">
              <Button 
                icon={<GlobalOutlined />}
                type="text"
                style={{ 
                  color: 'var(--grispi-text-secondary)'
                }}
              >
                {getCurrentLanguageInfo()?.nativeName || currentLanguage.toUpperCase()}
              </Button>
            </Dropdown>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserSwitchOutlined />} />
                {!isMobile && (
                  <span style={{ color: 'var(--grispi-text-secondary)' }}>Username</span>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        {/* Content */}
        <Content style={{ 
          padding: isMobile ? '16px' : '24px', 
          background: 'var(--grispi-bg-secondary)',
          minHeight: isMobile ? 'calc(100vh - 56px)' : 'calc(100vh - 64px)'
        }}>
          <div style={{ 
            maxWidth: isLargeDesktop ? 1400 : isDesktop ? 1200 : 1200, 
            margin: '0 auto',
            padding: isMobile ? '0 8px' : '0'
          }}>
            {/* Steps */}
            <div style={{ 
              background: 'var(--grispi-bg-primary)', 
              padding: isMobile ? '16px' : '24px', 
              borderRadius: '12px', 
              marginBottom: isMobile ? '16px' : '24px',
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
