import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Notification from '../common/Notification';
import './Layout.css';

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
    <div className={`layout ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Notifications */}
      <div className="notifications-container">
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
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />

      {/* Side Panel */}
      {/* <TechStackPanel isDarkMode={isDarkMode} /> */}
    </div>
  );
};

export default Layout;
