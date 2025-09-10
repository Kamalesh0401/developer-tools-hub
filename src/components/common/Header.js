// src/components/common/Header.js
import React from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }) => {
  const tabs = ['JSON', 'JWT', 'Base64'];

  return (
    <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 shadow-lg`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ChevronLeft className="w-5 h-5 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors" />
            <ChevronRight className="w-5 h-5 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Developer Tools Hub
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <nav className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab 
                    ? 'text-white bg-blue-600 shadow-lg transform scale-105' 
                    : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-yellow-400' 
                : 'hover:bg-gray-100 text-gray-600'
            } transform hover:scale-110`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;