import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/layout/Layout";
import JSONTool from "./components/tools/JSONTool";
import JWTTool from "./components/tools/JWTTool";
import Base64Tool from "./components/tools/Base64Tool";
import { useNotification } from "./hooks/useNotification";
import "./App.css";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { notifications, showNotification, removeNotification } =
    useNotification();

  return (
    <Router>
      <Layout
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        notifications={notifications}
        removeNotification={removeNotification}
      >
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/json-viewer" />} />

          {/* JSON Viewer Page */}
          <Route
            path="/json-viewer"
            element={
              <JSONTool
                isDarkMode={isDarkMode}
                showNotification={showNotification}
              />
            }
          />

          {/* JWT Decoder Page */}
          <Route
            path="/jwt-decoder"
            element={
              <JWTTool
                isDarkMode={isDarkMode}
                showNotification={showNotification}
              />
            }
          />

          {/* Base64 Tool Page */}
          <Route
            path="/base64-tool"
            element={
              <Base64Tool
                isDarkMode={isDarkMode}
                showNotification={showNotification}
              />
            }
          />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/json-viewer" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
