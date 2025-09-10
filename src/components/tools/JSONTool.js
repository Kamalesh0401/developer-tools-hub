// src/components/tools/JSONTool.js
import React, { useState, useEffect } from 'react';
import { Copy, AlertCircle, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { formatJSON, minifyJSON, validateJSON } from '../../utils/jsonUtils';

const JSONTool = ({ isDarkMode, showNotification }) => {
  const [input, setInput] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "city": "New York",\n  "hobbies": ["reading", "swimming", "coding"]\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [treeView, setTreeView] = useState({});
  const [isTreeMode, setIsTreeMode] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);

  const handleFormat = () => {
    try {
      const formatted = formatJSON(input);
      setOutput(formatted);
      setError('');
      showNotification('JSON formatted successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification('Invalid JSON format', 'error');
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyJSON(input);
      setOutput(minified);
      setError('');
      showNotification('JSON minified successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification('Invalid JSON format', 'error');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      showNotification('Copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Failed to copy', 'error');
    }
  };

  const toggleTreeNode = (path) => {
    setTreeView(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderTreeView = (obj, path = '', depth = 0) => {
    if (typeof obj !== 'object' || obj === null) {
      const valueColor = typeof obj === 'string' ? 'text-green-400' : 
                        typeof obj === 'number' ? 'text-blue-400' : 
                        typeof obj === 'boolean' ? 'text-purple-400' : 'text-gray-400';
      
      return (
        <span className={valueColor}>
          {typeof obj === 'string' ? `"${obj}"` : String(obj)}
        </span>
      );
    }

    const isExpanded = treeView[path] !== false;
    const entries = Object.entries(obj);
    const isArray = Array.isArray(obj);

    return (
      <div className={depth > 0 ? 'ml-4' : ''}>
        {depth > 0 && (
          <button
            onClick={() => toggleTreeNode(path)}
            className="flex items-center space-x-1 hover:bg-gray-700 px-1 rounded transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span className="text-blue-400">{isArray ? '[' : '{'}</span>
            <span className="text-gray-500 text-sm">
              {entries.length} {entries.length === 1 ? 'item' : 'items'}
            </span>
          </button>
        )}
        
        {isExpanded && (
          <div className="ml-4 border-l border-gray-600 pl-2">
            {entries.map(([key, value], index) => (
              <div key={key} className="py-1">
                <span className="text-orange-400">"{key}"</span>
                <span className="text-gray-400">: </span>
                {typeof value === 'object' && value !== null ? (
                  renderTreeView(value, `${path}.${key}`, depth + 1)
                ) : (
                  renderTreeView(value)
                )}
                {index < entries.length - 1 && <span className="text-gray-400">,</span>}
              </div>
            ))}
          </div>
        )}
        
        {depth > 0 && isExpanded && (
          <span className="text-blue-400">{isArray ? ']' : '}'}</span>
        )}
      </div>
    );
  };

  const addLineNumbers = (text) => {
    if (!lineNumbers) return text;
    return text.split('\n').map((line, index) => 
      `${(index + 1).toString().padStart(3, ' ')} | ${line}`
    ).join('\n');
  };

  useEffect(() => {
    if (input) {
      try {
        validateJSON(input);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            JSON Viewer / Formatter
          </h2>
          <p className="text-gray-500 mt-1">Format, validate, and visualize your JSON data</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setLineNumbers(!lineNumbers)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              lineNumbers
                ? 'bg-blue-600 border-blue-600 text-white'
                : isDarkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {lineNumbers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>Line Numbers</span>
          </button>
          <button
            onClick={() => setIsTreeMode(!isTreeMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              isTreeMode
                ? 'bg-green-600 border-green-600 text-white'
                : isDarkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>Tree View</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold flex items-center space-x-2">
              <span>Input</span>
              {!error && input && (
                <span className="text-green-400 text-sm">✓ Valid JSON</span>
              )}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleFormat}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Format / Beautify
              </button>
              <button
                onClick={handleMinify}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Minify
              </button>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full h-96 p-4 rounded-lg border font-mono text-sm resize-none ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
              placeholder="Paste your JSON here..."
            />
            {input && (
              <div className="absolute top-2 right-2">
                <div className={`px-2 py-1 rounded text-xs ${
                  error ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {error ? 'Invalid' : 'Valid'}
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="flex items-start space-x-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-red-400">JSON Error</div>
                <div className="text-sm text-red-300">{error}</div>
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Output</span>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>
          
          <div className={`w-full h-96 p-4 rounded-lg border overflow-auto ${
            isDarkMode
              ? 'bg-gray-800 border-gray-600'
              : 'bg-gray-50 border-gray-300'
          }`}>
            {output ? (
              isTreeMode && !error ? (
                <div className="font-mono text-sm">
                  {renderTreeView(JSON.parse(output))}
                </div>
              ) : (
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  {addLineNumbers(output)}
                </pre>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📝</div>
                  <div>Formatted JSON will appear here</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONTool;