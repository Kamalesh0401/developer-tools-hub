import React, { useState, useEffect, useCallback } from 'react';
import {
  Copy, AlertCircle, ChevronDown, ChevronRight, Eye, EyeOff,
  Download, Upload, Trash2, CheckCircle, Settings, RefreshCw,
  FileText, Code, Search, Zap, Filter, ArrowUpDown, Hash,
  Maximize2, Minimize2, RotateCcw
} from 'lucide-react';

const JSONTool = ({ isDarkMode = true, showNotification: externalShowNotification }) => {
  const [input, setInput] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com",\n  "active": true,\n  "hobbies": ["reading", "coding", "traveling"],\n  "address": {\n    "street": "123 Main St",\n    "city": "New York",\n    "zipCode": "10001"\n  },\n  "metadata": {\n    "createdAt": "2024-01-15T10:30:00Z",\n    "lastModified": "2024-01-20T14:45:00Z"\n  }\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [treeView, setTreeView] = useState({});
  const [isTreeMode, setIsTreeMode] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [stats, setStats] = useState({ size: 0, lines: 0, keys: 0 });
  const [indentSize, setIndentSize] = useState(2);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [bigNumbers, setBigNumbers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);
  const [escapeUnicode, setEscapeUnicode] = useState(false);

  const showNotification = useCallback((message, type = 'success') => {
    if (externalShowNotification) {
      externalShowNotification(message, type);
    } else {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    }
  }, [externalShowNotification]);

  const formatJSON = (jsonString, indent = indentSize) => {
    const parsed = JSON.parse(jsonString);
    let formatted;

    if (sortKeys) {
      formatted = JSON.stringify(sortObjectKeys(parsed), null, indent);
    } else {
      formatted = JSON.stringify(parsed, null, indent);
    }

    if (escapeUnicode) {
      formatted = formatted.replace(/[\u0080-\uFFFF]/g, (match) => {
        return "\\u" + ("0000" + match.charCodeAt(0).toString(16)).substr(-4);
      });
    }

    return formatted;
  };

  const sortObjectKeys = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      const sorted = {};
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = sortObjectKeys(obj[key]);
      });
      return sorted;
    }
    return obj;
  };

  const minifyJSON = (jsonString) => {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  };

  const validateJSON = (jsonString) => {
    if (!jsonString.trim()) return true;
    JSON.parse(jsonString);
    return true;
  };

  const calculateStats = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      const size = new Blob([jsonString]).size;
      const lines = jsonString.split('\n').length;
      const keys = countKeys(parsed);
      return { size, lines, keys };
    } catch {
      return { size: 0, lines: 0, keys: 0 };
    }
  };

  const countKeys = (obj) => {
    let count = 0;
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        count += obj.length;
        obj.forEach(item => count += countKeys(item));
      } else {
        count += Object.keys(obj).length;
        Object.values(obj).forEach(value => count += countKeys(value));
      }
    }
    return count;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (autoUpdate && value.trim()) {
      try {
        const formatted = formatJSON(value);
        setOutput(formatted);
        setError('');
      } catch (err) {
        // Don't show error on auto-update, just clear output
        setOutput('');
      }
    }
  };

  const handleFormat = () => {
    try {
      const formatted = formatJSON(input);
      setOutput(formatted);
      setError('');
      showNotification('JSON formatted successfully!', 'success');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
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
      setError(`Invalid JSON: ${err.message}`);
      showNotification('Invalid JSON format', 'error');
    }
  };

  const handleBeautify = () => {
    handleFormat();
  };

  const handleValidate = () => {
    try {
      validateJSON(input);
      setError('');
      showNotification('JSON is valid!', 'success');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      showNotification('Invalid JSON format', 'error');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setSearchTerm('');
    showNotification('Cleared successfully!', 'info');
  };

  const copyToClipboard = async (text = output) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Failed to copy', 'error');
    }
  };

  const downloadJSON = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('File downloaded!', 'success');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(e.target.result);
      showNotification('File uploaded successfully!', 'success');
    };
    reader.readAsText(file);
  };

  const convertToXML = () => {
    try {
      const parsed = JSON.parse(input);
      const xml = jsonToXML(parsed);
      setOutput(xml);
      showNotification('Converted to XML!', 'success');
    } catch (err) {
      setError(`Conversion failed: ${err.message}`);
      showNotification('Conversion failed', 'error');
    }
  };

  const convertToCSV = () => {
    try {
      const parsed = JSON.parse(input);
      const csv = jsonToCSV(parsed);
      setOutput(csv);
      showNotification('Converted to CSV!', 'success');
    } catch (err) {
      setError(`Conversion failed: ${err.message}`);
      showNotification('Conversion failed', 'error');
    }
  };

  const jsonToXML = (obj, rootName = 'root') => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`;

    const convertValue = (value, key) => {
      if (Array.isArray(value)) {
        return value.map(item => `<${key}>${typeof item === 'object' ? convertObject(item) : item}</${key}>`).join('');
      } else if (typeof value === 'object' && value !== null) {
        return `<${key}>${convertObject(value)}</${key}>`;
      } else {
        return `<${key}>${value}</${key}>`;
      }
    };

    const convertObject = (obj) => {
      return Object.entries(obj).map(([key, value]) => convertValue(value, key)).join('');
    };

    xml += convertObject(obj);
    xml += `</${rootName}>`;
    return xml;
  };

  const jsonToCSV = (obj) => {
    if (!Array.isArray(obj)) {
      obj = [obj];
    }

    const headers = Object.keys(obj[0]);
    const csvHeaders = headers.join(',');
    const csvRows = obj.map(row =>
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  };

  const toggleTreeNode = (path) => {
    setTreeView(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTreeView = (obj, path = '', depth = 0) => {
    if (typeof obj !== 'object' || obj === null) {
      const value = typeof obj === 'string' ? `"${obj}"` : String(obj);
      const highlighted = searchTerm && value.toLowerCase().includes(searchTerm.toLowerCase())
        ? value.replace(new RegExp(`(${searchTerm})`, 'gi'), '<mark>$1</mark>')
        : value;

      return (
        <span
          className={`tree-value tree-value-${typeof obj}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    }

    const isExpanded = treeView[path] !== false;
    const entries = Object.entries(obj);
    const isArray = Array.isArray(obj);

    return (
      <div className="tree-node">
        <div className="tree-toggle" onClick={() => toggleTreeNode(path)}>
          {isExpanded ?
            <ChevronDown className="tree-icon" /> :
            <ChevronRight className="tree-icon" />
          }
          <span className="tree-bracket">{isArray ? '[' : '{'}</span>
          <span className="tree-count">
            {entries.length} {entries.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        {isExpanded && (
          <div className="tree-children">
            {entries.map(([key, value], idx) => (
              <div key={key} className="tree-entry">
                <span className="tree-key">"{key}"</span>
                <span className="tree-colon">: </span>
                {renderTreeView(value, `${path}.${key}`, depth + 1)}
                {idx < entries.length - 1 && <span className="tree-comma">,</span>}
              </div>
            ))}
          </div>
        )}
        {isExpanded && <span className="tree-bracket">{isArray ? ']' : '}'}</span>}
      </div>
    );
  };

  const addLineNumbers = (text) => {
    if (!lineNumbers || !text) return text;
    return text.split('\n').map((line, idx) =>
      `${(idx + 1).toString().padStart(3, ' ')} | ${line}`
    ).join('\n');
  };

  const highlightSearch = (text) => {
    if (!searchTerm || !text) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  useEffect(() => {
    if (input) {
      try {
        validateJSON(input);
        setError('');
        setIsValid(true);
        setStats(calculateStats(input));
      } catch (err) {
        setError(err.message);
        setIsValid(false);
        setStats({ size: 0, lines: 0, keys: 0 });
      }
    } else {
      setError('');
      setIsValid(true);
      setStats({ size: 0, lines: 0, keys: 0 });
    }
  }, [input]);

  return (
    <div className={`json-tool-container ${isDarkMode ? 'dark' : 'light'} ${isFullscreen ? 'fullscreen' : ''}`}>
      <style>{`
        .json-tool-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          padding: 1rem;
          transition: all 0.3s ease;
          border-radius: 1.25rem;
          position: relative;
        }
        
        .json-tool-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          padding: 0;
          border-radius: 0;
          margin: 0;
        }
        
        .json-tool-container.dark {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #e2e8f0;
        }
        
        .json-tool-container.light {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #1e293b;
        }

        /* Notification */
        .notification {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1000;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          color: white;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: slideIn 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .notification.success { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .notification.error { 
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        .notification.info { 
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .json-tool-container.dark .header {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.3);
        }
        
        .json-tool-container.light .header {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.3);
        }
        
        .title {
          font-size: 2.5rem;
          font-weight: bold;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          text-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }
        
        .subtitle {
          color: #64748b;
          margin: 0.5rem 0 0 0;
          font-size: 1.1rem;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Stats */
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .json-tool-container.dark .stats {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.3);
        }
        
        .json-tool-container.light .stats {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.3);
        }
        
        .stat-item {
          text-align: center;
          padding: 1rem;
          border-radius: 0.75rem;
          transition: transform 0.2s ease;
        }
        
        .stat-item:hover {
          transform: translateY(-2px);
        }
        
        .json-tool-container.dark .stat-item {
          background: rgba(15, 23, 42, 0.5);
        }
        
        .json-tool-container.light .stat-item {
          background: rgba(248, 250, 252, 0.8);
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
          text-shadow: 0 0 20px currentColor;
        }
        
        .stat-value.blue { color: #3b82f6; }
        .stat-value.green { color: #10b981; }
        .stat-value.purple { color: #8b5cf6; }
        .stat-value.red { color: #ef4444; }
        
        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Middle Controls Section */
        .middle-controls {
          margin: 2rem 0;
          padding: 1.5rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .json-tool-container.dark .middle-controls {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.3);
        }
        
        .json-tool-container.light .middle-controls {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.3);
        }

        .controls-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
          align-items: center;
        }

        .controls-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .controls-divider {
          width: 1px;
          height: 2rem;
          background-color: rgba(100, 116, 139, 0.3);
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
        
        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .btn:hover::before {
          left: 100%;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .btn-secondary {
          background: linear-gradient(135deg, #64748b, #475569);
          color: white;
          box-shadow: 0 4px 15px rgba(100, 116, 139, 0.3);
        }
        
        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }
        
        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        
        .btn-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }
        
        .btn-toggle {
          border: 2px solid #64748b;
          background: rgba(100, 116, 139, 0.1);
          backdrop-filter: blur(10px);
        }
        
        .json-tool-container.dark .btn-toggle {
          color: #e2e8f0;
        }
        
        .json-tool-container.light .btn-toggle {
          color: #1e293b;
        }
        
        .btn-toggle:hover:not(:disabled) {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .btn-toggle.active {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-color: #2563eb;
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .btn-toggle.active.green {
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: #059669;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .select, .input {
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #64748b;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }
        
        .input {
          min-width: 200px;
        }
        
        .json-tool-container.dark .select, 
        .json-tool-container.dark .input {
          background: rgba(15, 23, 42, 0.8);
          color: #e2e8f0;
          border-color: #475569;
        }
        
        .json-tool-container.light .select, 
        .json-tool-container.light .input {
          background: rgba(255, 255, 255, 0.8);
          color: #1e293b;
          border-color: #d1d5db;
        }
        
        .select:focus, .input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Main Layout */
        .main-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          height: 600px;
        }
        
        @media (max-width: 1024px) {
          .main-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
        }

        /* Panel */
        .panel {
          display: flex;
          flex-direction: column;
          border-radius: 1rem;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
        }
        
        .panel:hover {
          transform: translateY(-2px);
        }
        
        .json-tool-container.dark .panel {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.3);
        }
        
        .json-tool-container.light .panel {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.3);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.1);
        }
        
        .json-tool-container.dark .panel-header {
          border-color: rgba(71, 85, 105, 0.3);
        }
        
        .json-tool-container.light .panel-header {
          border-color: rgba(226, 232, 240, 0.3);
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
          backdrop-filter: blur(10px);
        }
        
        .status-badge.valid {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
        }
        
        .status-badge.invalid {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
        }

        .panel-controls {
          display: flex;
          gap: 0.5rem;
        }

        /* Content Area */
        .panel-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .textarea, .output-area {
          flex: 1;
          padding: 1rem;
          font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          border: none;
          outline: none;
          resize: none;
          white-space: pre-wrap;
          overflow: auto;
          background: transparent;
        }
        
        .json-tool-container.dark .textarea, 
        .json-tool-container.dark .output-area {
          color: #e2e8f0;
        }
        
        .json-tool-container.light .textarea, 
        .json-tool-container.light .output-area {
          color: #1e293b;
        }

        .output-area {
          min-height: 400px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #64748b;
          text-align: center;
          padding: 2rem;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        /* Error */
        .error-message {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
          border-top: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          font-size: 0.875rem;
          backdrop-filter: blur(10px);
        }

        /* Tree View */
        .tree-node {
          margin: 0.25rem 0;
        }

        .tree-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.375rem 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .tree-toggle:hover {
          background: rgba(59, 130, 246, 0.1);
          transform: translateX(2px);
        }

        .tree-icon {
          width: 1rem;
          height: 1rem;
          color: #64748b;
          transition: color 0.2s ease;
        }
        
        .tree-toggle:hover .tree-icon {
          color: #3b82f6;
        }

        .tree-bracket {
          color: #3b82f6;
          font-weight: bold;
        }

        .tree-count {
          font-size: 0.75rem;
          color: #64748b;
          background: rgba(100, 116, 139, 0.1);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }

        .tree-children {
          margin-left: 1.5rem;
          border-left: 2px solid rgba(59, 130, 246, 0.2);
          padding-left: 1rem;
          margin-top: 0.5rem;
          position: relative;
        }
        
        .tree-children::before {
          content: '';
          position: absolute;
          left: -2px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #3b82f6, transparent);
        }

        .tree-entry {
          margin: 0.375rem 0;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.2s ease;
          padding: 0.25rem;
          border-radius: 0.25rem;
        }
        
        .tree-entry:hover {
          background: rgba(59, 130, 246, 0.05);
        }

        .tree-key {
          color: #f97316;
          font-weight: 600;
        }

        .tree-colon {
          color: #64748b;
        }

        .tree-comma {
          color: #64748b;
        }

        .tree-value-string {
          color: #10b981;
        }

        .tree-value-number {
          color: #3b82f6;
          font-weight: 600;
        }

        .tree-value-boolean {
          color: #8b5cf6;
          font-weight: 600;
        }

        .tree-value-object,
        .tree-value-undefined {
          color: #64748b;
        }
        
        mark {
          background: rgba(251, 191, 36, 0.3);
          color: inherit;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }

        /* Search Input */
        .search-container {
          position: relative;
        }
        
        .search-input {
          padding-left: 2.5rem;
        }
        
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          width: 1rem;
          height: 1rem;
        }

        /* Footer */
        .footer {
          text-align: center;
          margin-top: 3rem;
          padding: 2rem;
          color: #64748b;
          font-size: 0.875rem;
          border-top: 1px solid rgba(100, 116, 139, 0.2);
          background: rgba(0, 0, 0, 0.05);
          border-radius: 1rem;
          backdrop-filter: blur(10px);
        }

        /* Checkbox */
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease;
        }
        
        .checkbox-group:hover {
          background: rgba(59, 130, 246, 0.1);
        }
        
        .checkbox {
          width: 1rem;
          height: 1rem;
          border-radius: 0.25rem;
          border: 2px solid #64748b;
          position: relative;
          transition: all 0.2s ease;
        }
        
        .checkbox.checked {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-color: #2563eb;
        }
        
        .checkbox.checked::after {
          content: '✓';
          position: absolute;
          top: -2px;
          left: 1px;
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .json-tool-container {
            padding: 0.5rem;
          }
          
          .json-tool-container.fullscreen {
            padding: 0.5rem;
          }
          
          .header, .stats, .middle-controls {
            padding: 1rem;
          }
          
          .title {
            font-size: 2rem;
          }
          
          .controls-row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .controls-group {
            justify-content: center;
          }
          
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .panel-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .panel-controls {
            flex-wrap: wrap;
          }
        }

        /* Scrollbar Styling */
        .textarea::-webkit-scrollbar,
        .output-area::-webkit-scrollbar {
          width: 8px;
        }
        
        .textarea::-webkit-scrollbar-track,
        .output-area::-webkit-scrollbar-track {
          background: rgba(100, 116, 139, 0.1);
          border-radius: 4px;
        }
        
        .textarea::-webkit-scrollbar-thumb,
        .output-area::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #64748b, #475569);
          border-radius: 4px;
        }
        
        .textarea::-webkit-scrollbar-thumb:hover,
        .output-area::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #475569, #334155);
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' && <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />}
          {notification.type === 'error' && <AlertCircle style={{ width: '1.25rem', height: '1.25rem' }} />}
          {notification.type === 'info' && <RefreshCw style={{ width: '1.25rem', height: '1.25rem' }} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="container">
        {/* Header */}
        <div className="header">
          <div>
            <h1 className="title">JSON Toolkit Pro</h1>
            <p className="subtitle">Advanced JSON formatting, validation, and visualization tool</p>
          </div>

          <div className="header-controls">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-toggle"
            >
              {isFullscreen ? <Minimize2 style={{ width: '1rem', height: '1rem' }} /> : <Maximize2 style={{ width: '1rem', height: '1rem' }} />}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings style={{ width: '1rem', height: '1rem' }} />
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="select"
              >
                <option value={2}>2 Tab Space</option>
                <option value={4}>4 Tab Space</option>
                <option value={8}>8 Tab Space</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-item">
            <div className="stat-value blue">{stats.size}</div>
            <div className="stat-label">Bytes</div>
          </div>
          <div className="stat-item">
            <div className="stat-value green">{stats.lines}</div>
            <div className="stat-label">Lines</div>
          </div>
          <div className="stat-item">
            <div className="stat-value purple">{stats.keys}</div>
            <div className="stat-label">Keys</div>
          </div>
          <div className="stat-item">
            <div className={`stat-value ${isValid ? 'green' : 'red'}`}>
              {isValid ? '✓' : '✗'}
            </div>
            <div className="stat-label">Valid JSON</div>
          </div>
        </div>

        {/* Middle Controls Section */}
        <div className="middle-controls">
          {/* Row 1: Main Actions */}
          <div className="controls-row">
            <div className="controls-group">
              <button onClick={handleBeautify} disabled={!input || !isValid} className="btn btn-primary">
                <Code style={{ width: '1rem', height: '1rem' }} />
                Beautify
              </button>

              <button onClick={handleMinify} disabled={!input || !isValid} className="btn btn-secondary">
                Minify
              </button>

              <button onClick={handleValidate} disabled={!input} className="btn btn-warning">
                <CheckCircle style={{ width: '1rem', height: '1rem' }} />
                Validate
              </button>
            </div>

            <div className="controls-divider"></div>

            <div className="controls-group">
              <button onClick={convertToXML} disabled={!input || !isValid} className="btn btn-success">
                to XML
              </button>

              <button onClick={convertToCSV} disabled={!input || !isValid} className="btn btn-success">
                to CSV
              </button>
            </div>

            <div className="controls-divider"></div>

            <div className="controls-group">
              <button onClick={downloadJSON} disabled={!output} className="btn btn-primary">
                <Download style={{ width: '1rem', height: '1rem' }} />
                Download
              </button>

              <label className="btn btn-success">
                <Upload style={{ width: '1rem', height: '1rem' }} />
                Upload
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="file-input"
                />
              </label>

              <button onClick={handleClear} className="btn btn-danger">
                <Trash2 style={{ width: '1rem', height: '1rem' }} />
                Clear
              </button>
            </div>
          </div>

          {/* Row 2: View Options */}
          <div className="controls-row">
            <div className="controls-group">
              <button
                onClick={() => setIsTreeMode(!isTreeMode)}
                className={`btn btn-toggle ${isTreeMode ? 'active green' : ''}`}
              >
                <FileText style={{ width: '1rem', height: '1rem' }} />
                Tree Viewer
              </button>

              <div className="controls-divider"></div>

              <div className="checkbox-group" onClick={() => setAutoUpdate(!autoUpdate)}>
                <div className={`checkbox ${autoUpdate ? 'checked' : ''}`}></div>
                <span>Auto Update</span>
              </div>

              <div className="checkbox-group" onClick={() => setBigNumbers(!bigNumbers)}>
                <div className={`checkbox ${bigNumbers ? 'checked' : ''}`}></div>
                <span>Big Num</span>
              </div>

              <div className="checkbox-group" onClick={() => setLineNumbers(!lineNumbers)}>
                <div className={`checkbox ${lineNumbers ? 'checked' : ''}`}></div>
                <span>Line Numbers</span>
              </div>
            </div>

            <div className="controls-divider"></div>

            <div className="controls-group">
              <div className="checkbox-group" onClick={() => setSortKeys(!sortKeys)}>
                <div className={`checkbox ${sortKeys ? 'checked' : ''}`}></div>
                <span>Sort Keys</span>
              </div>

              <div className="checkbox-group" onClick={() => setEscapeUnicode(!escapeUnicode)}>
                <div className={`checkbox ${escapeUnicode ? 'checked' : ''}`}></div>
                <span>Escape Unicode</span>
              </div>
            </div>

            <div className="controls-divider"></div>

            <div className="controls-group">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search in JSON..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input search-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Input Left, Output Right */}
        <div className="main-layout">
          {/* Input Panel (Left) */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <h3>Input</h3>
                {input && (
                  <span className={`status-badge ${isValid ? 'valid' : 'invalid'}`}>
                    {isValid ? <CheckCircle style={{ width: '0.75rem', height: '0.75rem' }} /> : <AlertCircle style={{ width: '0.75rem', height: '0.75rem' }} />}
                    {isValid ? 'Valid JSON' : 'Invalid JSON'}
                  </span>
                )}
              </div>
              <div className="panel-controls">
                <button
                  onClick={() => copyToClipboard(input)}
                  disabled={!input}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                >
                  <Copy style={{ width: '0.875rem', height: '0.875rem' }} />
                </button>
                <button
                  onClick={() => setInput('')}
                  disabled={!input}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                >
                  <RotateCcw style={{ width: '0.875rem', height: '0.875rem' }} />
                </button>
              </div>
            </div>

            <div className="panel-content">
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Paste your JSON here..."
                className="textarea"
                style={{ tabSize: indentSize }}
              />

              {error && (
                <div className="error-message">
                  <AlertCircle style={{ width: '1rem', height: '1rem', marginTop: '0.125rem', flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Output Panel (Right) */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <h3>Output</h3>
                {output && (
                  <span className="status-badge valid">
                    <Zap style={{ width: '0.75rem', height: '0.75rem' }} />
                    {isTreeMode ? 'Tree View' : 'Formatted'}
                  </span>
                )}
              </div>
              <div className="panel-controls">
                <button
                  onClick={() => copyToClipboard()}
                  disabled={!output}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                >
                  <Copy style={{ width: '0.875rem', height: '0.875rem' }} />
                </button>
                <button
                  onClick={downloadJSON}
                  disabled={!output}
                  className="btn btn-success"
                  style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                >
                  <Download style={{ width: '0.875rem', height: '0.875rem' }} />
                </button>
                <button
                  onClick={() => setOutput('')}
                  disabled={!output}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                >
                  <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                </button>
              </div>
            </div>

            <div className="panel-content">
              <div className="output-area">
                {output ? (
                  isTreeMode && !error && isValid ? (
                    <div style={{ fontSize: '0.875rem' }}>
                      {(() => {
                        try {
                          return renderTreeView(JSON.parse(output));
                        } catch {
                          return <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{addLineNumbers(output)}</pre>;
                        }
                      })()}
                    </div>
                  ) : (
                    <pre
                      style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{
                        __html: searchTerm ? highlightSearch(addLineNumbers(output)) : addLineNumbers(output)
                      }}
                    />
                  )
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">⚡</div>
                    <div>Formatted JSON will appear here</div>
                    <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>
                      Use Beautify, Minify, or any conversion tool
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>
            <strong>JSON Toolkit Pro</strong> - Complete JSON processing solution with formatting,
            validation, tree visualization, search, and conversion capabilities
          </p>
        </div>
      </div>
    </div>
  );
};

export default JSONTool;