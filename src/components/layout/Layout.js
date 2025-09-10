// src/components/layout/Layout.js
import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Notification from '../common/Notification';
import TechStackPanel from '../common/TechStackPanel';

const Layout = ({
  children,
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  notifications,
  removeNotification
}) => {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />

      {/* Side Panel */}
      <TechStackPanel isDarkMode={isDarkMode} />
    </div>
  );
};

export default Layout;