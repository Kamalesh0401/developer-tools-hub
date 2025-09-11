import React, { useState, useEffect, useCallback } from 'react';
import { Copy, AlertCircle, ChevronDown, ChevronRight, Eye, EyeOff, Download, Upload, Trash2, CheckCircle, Settings, RefreshCw } from 'lucide-react';

const JSONTool = ({ isDarkMode = true, showNotification: externalShowNotification }) => {
  const [input, setInput] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com",\n  "active": true,\n  "hobbies": ["reading", "coding", "traveling"],\n  "address": {\n    "street": "123 Main St",\n    "city": "New York",\n    "zipCode": "10001"\n  }\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [treeView, setTreeView] = useState({});
  const [isTreeMode, setIsTreeMode] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [stats, setStats] = useState({ size: 0, lines: 0, keys: 0 });
  const [indentSize, setIndentSize] = useState(2);

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
    return JSON.stringify(parsed, null, indent);
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
    setInput(value);      // Update the input state
    handleFormat(value);  // Call handleFormat with the new value
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

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
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

  const toggleTreeNode = (path) => {
    setTreeView(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTreeView = (obj, path = '', depth = 0) => {
    if (typeof obj !== 'object' || obj === null) {
      return (
        <span className={`tree-value tree-value-${typeof obj}`}>
          {typeof obj === 'string' ? `"${obj}"` : String(obj)}
        </span>
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
    <div className={`json-tool-container ${isDarkMode ? 'dark' : 'light'}`}>
      <style>{`
        .json-tool-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          padding: 1rem;
          transition: all 0.3s ease;
          border-radius: 1.25rem;
        }
        
        .json-tool-container.dark {
          background-color: #232730;
          color: #D9DEEF;
        }
        
        .json-tool-container.light {
          background-color: #f8fafc;
          color: #1e293b;
        }

        /* Notification */
        .notification {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1000;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          color: white;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .notification.success { background-color: #16a34a; }
        .notification.error { background-color: #dc2626; }
        .notification.info { background-color: #2563eb; }

        /* Header */
        .header {
          // display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .title {
          font-size: 2.5rem;
          font-weight: bold;
          background: #ffff;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }
        
        .subtitle {
          color: #6b7280;
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
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .json-tool-container.dark .stats {
          background-color: ##232730;
          border: 1px solid #4e5259;
        }
        
        .json-tool-container.light .stats {
          background-color: white;
          border: 1px solid #e2e8f0;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }
        
        .stat-value.blue { color: #3b82f6; }
        .stat-value.green { color: #16a34a; }
        .stat-value.purple { color: #8b5cf6; }
        .stat-value.red { color: #dc2626; }
        
        .stat-label {
          font-size: 0.875rem;
          color: #4e5259;
        }

        /* Controls */
        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }
        
        .btn-primary {
          background-color: #2563eb;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background-color: #1d4ed8;
        }
        
        .btn-secondary {
          background-color: #4b5563;
          color: white;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background-color: #374151;
        }
        
        .btn-danger {
          background-color: #dc2626;
          color: white;
        }
        
        .btn-danger:hover:not(:disabled) {
          background-color: #b91c1c;
        }
        
        .btn-success {
          background-color: #16a34a;
          color: white;
        }
        
        .btn-success:hover:not(:disabled) {
          background-color: #15803d;
        }
        
        .btn-toggle {
          border: 2px solid #6b7280;
          background-color: transparent;
        }
        
        .json-tool-container.dark .btn-toggle {
          color: #e2e8f0;
        }
        
        .json-tool-container.light .btn-toggle {
          color: #1e293b;
        }
        
        .btn-toggle:hover:not(:disabled) {
          border-color: #3b82f6;
        }
        
        .btn-toggle.active {
          background-color: #2563eb;
          border-color: #2563eb;
          color: white;
        }
        
        .btn-toggle.active.green {
          background-color: #16a34a;
          border-color: #16a34a;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .select {
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          border: 1px solid #6b7280;
          font-size: 0.875rem;
        }
        
        .json-tool-container.dark .select {
          background-color: #374151;
          color: #e2e8f0;
          border-color: #4b5563;
        }
        
        .json-tool-container.light .select {
          background-color: white;
          color: #1e293b;
          border-color: #d1d5db;
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
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .json-tool-container.dark .panel {
          background-color: #232730;
          border: 1px solid #334155;
        }
        
        .json-tool-container.light .panel {
          background-color: white;
          border: 1px solid #e2e8f0;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid;
          font-weight: 600;
        }
        
        .json-tool-container.dark .panel-header {
          border-color: #334155;
          background-color: #232730;
        }
        
        .json-tool-container.light .panel-header {
          border-color: #e2e8f0;
          background-color: #f8fafc;
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
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
        }
        
        .status-badge.valid {
          background-color: #16a34a;
        }
        
        .status-badge.invalid {
          background-color: #dc2626;
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
          font-family: 'Monaco', 'Consolas', 'Liberation Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          border: none;
          outline: none;
          resize: none;
          white-space: pre-wrap;
          overflow: auto;
        }
        
        .json-tool-container.dark .textarea, 
        .json-tool-container.dark .output-area {
          background-color: #15181f;
          color: #e2e8f0;
        }
        
        .json-tool-container.light .textarea, 
        .json-tool-container.light .output-area {
          background-color: #f8fafc;
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
          color: #6b7280;
          text-align: center;
          padding: 2rem;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        /* Error */
        .error-message {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background-color: rgba(248, 113, 113, 0.1);
          border-top: 1px solid rgba(248, 113, 113, 0.2);
          color: #ef4444;
          font-size: 0.875rem;
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
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: background-color 0.2s ease;
          font-family: monospace;
        }
        
        .tree-toggle:hover {
          background-color: rgba(107, 114, 128, 0.1);
        }

        .tree-icon {
          width: 1rem;
          height: 1rem;
          color: #6b7280;
        }

        .tree-bracket {
          color: #3b82f6;
          font-weight: bold;
        }

        .tree-count {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .tree-children {
          margin-left: 1.5rem;
          border-left: 1px solid #4b5563;
          padding-left: 1rem;
          margin-top: 0.25rem;
        }

        .tree-entry {
          margin: 0.25rem 0;
          font-family: monospace;
        }

        .tree-key {
          color: #f97316;
          font-weight: 500;
        }

        .tree-colon {
          color: #6b7280;
        }

        .tree-comma {
          color: #6b7280;
        }

        .tree-value-string {
          color: #16a34a;
        }

        .tree-value-number {
          color: #3b82f6;
        }

        .tree-value-boolean {
          color: #8b5cf6;
        }

        .tree-value-object,
        .tree-value-undefined {
          color: #6b7280;
        }

        /* Footer */
        .footer {
          text-align: center;
          margin-top: 3rem;
          padding-top: 2rem;
          color: #6b7280;
          font-size: 0.875rem;
          border-top: 1px solid #374151;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .json-tool-container {
            padding: 1rem;
          }
          
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .controls {
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
      `}</style>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' && <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />}
          {notification.type === 'error' && <AlertCircle style={{ width: '1.25rem', height: '1.25rem' }} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* container */}
      <div className="">
        {/* Header */}
        <div className="header">
          <div>
            <h1 className="title">JSON Tool</h1>
            <p className="subtitle">Format, validate, and visualize your JSON data with ease</p>
          </div>

          <div className="header-controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings style={{ width: '1rem', height: '1rem' }} />
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="select"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
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
            <div className="stat-label">Status</div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <button onClick={handleFormat} disabled={!input} className="btn btn-primary">
            <RefreshCw style={{ width: '1rem', height: '1rem' }} />
            Format
          </button>

          <button onClick={handleMinify} disabled={!input} className="btn btn-secondary">
            Minify
          </button>

          <button onClick={handleClear} className="btn btn-danger">
            <Trash2 style={{ width: '1rem', height: '1rem' }} />
            Clear
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

          <button
            onClick={() => setLineNumbers(!lineNumbers)}
            className={`btn btn-toggle ${lineNumbers ? 'active' : ''}`}
          >
            {lineNumbers ? <Eye style={{ width: '1rem', height: '1rem' }} /> : <EyeOff style={{ width: '1rem', height: '1rem' }} />}
            Lines
          </button>

          <button
            onClick={() => setIsTreeMode(!isTreeMode)}
            className={`btn btn-toggle ${isTreeMode ? 'active green' : ''}`}
          >
            Tree View
          </button>
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
                    {isValid ? 'Valid' : 'Invalid'}
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
              </div>
            </div>

            <div className="panel-content">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                //onChange={handleInputChange}
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
              <h3>Output</h3>
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
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{addLineNumbers(output)}</pre>
                  )
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <div>Formatted JSON will appear here</div>
                    <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Use Format or Minify buttons</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>Supports JSON formatting, minification, validation, and tree visualization</p>
        </div>
      </div>
    </div>
  );
};

export default JSONTool;