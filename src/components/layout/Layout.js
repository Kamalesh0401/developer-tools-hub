import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../common/Header";
import Footer from "../common/Footer";
import Notification from "../common/Notification";
import "./Layout.css";

const Layout = ({
  children,
  isDarkMode,
  setIsDarkMode,
  notifications,
  removeNotification,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on URL
  const getActiveTab = () => {
    if (location.pathname.includes("json-viewer")) return "JSON";
    if (location.pathname.includes("jwt-decoder")) return "JWT";
    if (location.pathname.includes("base64-tool")) return "Base64";
    return "JSON";
  };

  const activeTab = getActiveTab();

  // Handle navigation when clicking header buttons
  const handleTabChange = (tab) => {
    switch (tab) {
      case "JSON":
        navigate("/json-viewer");
        break;
      case "JWT":
        navigate("/jwt-decoder");
        break;
      case "Base64":
        navigate("/base64-tool");
        break;
      default:
        navigate("/json-viewer");
    }
  };

  return (
    <div className={`layout ${isDarkMode ? "dark" : "light"}`}>
      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((notification) => (
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
        setActiveTab={handleTabChange}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">{children}</div>
      </main>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Layout;
