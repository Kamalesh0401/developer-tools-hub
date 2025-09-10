// src/App.js
import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import JSONTool from './components/tools/JSONTool';
import JWTTool from './components/tools/JWTTool';
import Base64Tool from './components/tools/Base64Tool';
import { useNotification } from './hooks/useNotification';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('JSON');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { notifications, showNotification, removeNotification } = useNotification();

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'JSON':
        return <JSONTool isDarkMode={isDarkMode} showNotification={showNotification} />;
      case 'JWT':
        return <JWTTool isDarkMode={isDarkMode} showNotification={showNotification} />;
      case 'Base64':
        return <Base64Tool isDarkMode={isDarkMode} showNotification={showNotification} />;
      default:
        return <JSONTool isDarkMode={isDarkMode} showNotification={showNotification} />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      notifications={notifications}
      removeNotification={removeNotification}
    >
      {renderActiveComponent()}
    </Layout>
  );
};

export default App;
