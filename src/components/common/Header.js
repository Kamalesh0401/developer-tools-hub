import React from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import './Header.css';

const Header = ({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }) => {
  const tabs = ['JSON', 'JWT', 'Base64'];

  return (
    <header className={`header-com ${isDarkMode ? 'header-dark' : 'header-light'}`}>
      <div className="header-container">
        {/* Left Section */}
        <div className="header-left">
          <div className="header-nav-icons">
            <ChevronLeft className="nav-icon" />
            <ChevronRight className="nav-icon" />
          </div>
          <h1 className={`header-title ${isDarkMode ? 'dark' : 'ight'}`}>Developer Tools Hub</h1>
        </div>

        {/* Right Section */}
        <div className="header-right">
          <nav className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${activeTab === tab
                  ? 'tab-active'
                  : isDarkMode
                    ? 'tab-dark'
                    : 'tab-light'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`dark-toggle ${isDarkMode ? 'dark-toggle-active' : ''}`}
          >
            {isDarkMode ? <Sun className="icon" /> : <Moon className="icon" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
