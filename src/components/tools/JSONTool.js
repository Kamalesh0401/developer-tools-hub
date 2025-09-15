/* global BigInt */
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Copy, AlertCircle, ChevronDown, ChevronRight,
//   Download, Upload, Trash2, CheckCircle, Settings, RefreshCw,
//   FileText, Code, Search, Zap, Maximize2, Minimize2, RotateCcw,
//   Braces, Brackets, FileJson, FileSpreadsheet, FileCode2
// } from 'lucide-react';

// const JSONTool = ({ isDarkMode = true, showNotification: externalShowNotification }) => {
//   const [input, setInput] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com",\n  "active": true,\n  "hobbies": ["reading", "coding", "traveling"],\n  "address": {\n    "street": "123 Main St",\n    "city": "New York",\n    "zipCode": "10001"\n  },\n  "metadata": {\n    "createdAt": "2024-01-15T10:30:00Z",\n    "lastModified": "2024-01-20T14:45:00Z"\n  }\n}');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');
//   const [treeView, setTreeView] = useState({});
//   const [isTreeMode, setIsTreeMode] = useState(false);
//   const [lineNumbers, setLineNumbers] = useState(true);
//   const [notification, setNotification] = useState(null);
//   const [isValid, setIsValid] = useState(true);
//   const [stats, setStats] = useState({ size: 0, lines: 0, keys: 0 });
//   const [indentSize, setIndentSize] = useState(2);
//   const [autoUpdate, setAutoUpdate] = useState(false);
//   const [bigNumbers, setBigNumbers] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [sortKeys, setSortKeys] = useState(false);
//   const [escapeUnicode, setEscapeUnicode] = useState(false);

//   const showNotification = useCallback((message, type = 'success') => {
//     if (externalShowNotification) {
//       externalShowNotification(message, type);
//     } else {
//       setNotification({ message, type });
//       setTimeout(() => setNotification(null), 3000);
//     }
//   }, [externalShowNotification]);

//   const parseJSON = (jsonString) => {
//     if (bigNumbers) {
//       return JSON.parse(jsonString, (key, value) =>
//         typeof value === 'number' && !Number.isSafeInteger(value) ? BigInt(value) : value
//       );
//     }
//     return JSON.parse(jsonString);
//   };

//   const stringifyJSON = (parsed, indent = indentSize) => {
//     let formatted = JSON.stringify(parsed, (key, value) =>
//       typeof value === 'bigint' ? value.toString() : value,
//       indent
//     );

//     if (sortKeys) {
//       const sorted = sortObjectKeys(parsed);
//       formatted = JSON.stringify(sorted, (key, value) =>
//         typeof value === 'bigint' ? value.toString() : value,
//         indent
//       );
//     }

//     if (escapeUnicode) {
//       formatted = formatted.replace(/[\u0080-\uFFFF]/g, (match) => {
//         return "\\u" + ("0000" + match.charCodeAt(0).toString(16)).substr(-4);
//       });
//     }

//     return formatted;
//   };

//   const sortObjectKeys = (obj) => {
//     if (Array.isArray(obj)) {
//       return obj.map(sortObjectKeys);
//     } else if (obj !== null && typeof obj === 'object') {
//       const sorted = {};
//       Object.keys(obj).sort().forEach(key => {
//         sorted[key] = sortObjectKeys(obj[key]);
//       });
//       return sorted;
//     }
//     return obj;
//   };

//   const minifyJSON = (jsonString) => {
//     const parsed = parseJSON(jsonString);
//     return JSON.stringify(parsed, (key, value) =>
//       typeof value === 'bigint' ? value.toString() : value
//     );
//   };

//   const validateJSON = (jsonString) => {
//     try {
//       if (!jsonString.trim()) return true;
//       parseJSON(jsonString);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const calculateStats = (jsonString) => {
//     try {
//       const parsed = parseJSON(jsonString);
//       const size = new Blob([jsonString]).size;
//       const lines = jsonString.split('\n').length;
//       const keys = countKeys(parsed);
//       return { size, lines, keys };
//     } catch {
//       return { size: 0, lines: 0, keys: 0 };
//     }
//   };

//   const countKeys = (obj) => {
//     let count = 0;
//     if (typeof obj === 'object' && obj !== null) {
//       if (Array.isArray(obj)) {
//         obj.forEach(item => count += countKeys(item));
//       } else {
//         count += Object.keys(obj).length;
//         Object.values(obj).forEach(value => count += countKeys(value));
//       }
//     }
//     return count;
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setInput(value);
//     if (autoUpdate && value.trim()) {
//       if (validateJSON(value)) {
//         try {
//           const parsed = parseJSON(value);
//           const formatted = stringifyJSON(parsed);
//           setOutput(formatted);
//           setError('');
//         } catch (err) {
//           setOutput('');
//         }
//       } else {
//         setOutput('');
//       }
//     }
//   };

//   const handleTreeViewFormat = (e) => {
//     setIsTreeMode(true)
//     if (!validateJSON(input)) {
//       setError('Invalid JSON');
//       showNotification('Invalid JSON format', 'error');
//       return;
//     }
//     try {
//       const parsed = parseJSON(input);
//       const formatted = stringifyJSON(parsed);
//       setOutput(formatted);
//       setError('');
//       showNotification('JSON formatted successfully!', 'success');
//     } catch (err) {
//       setError(`Invalid JSON: ${err.message}`);
//       showNotification('Invalid JSON format', 'error');
//     }
//   };

//   const handleFormat = () => {
//     setIsTreeMode(false)
//     if (!validateJSON(input)) {
//       setError('Invalid JSON');
//       showNotification('Invalid JSON format', 'error');
//       return;
//     }
//     try {
//       const parsed = parseJSON(input);
//       const formatted = stringifyJSON(parsed);
//       setOutput(formatted);
//       setError('');
//       showNotification('JSON formatted successfully!', 'success');
//     } catch (err) {
//       setError(`Invalid JSON: ${err.message}`);
//       showNotification('Invalid JSON format', 'error');
//     }
//   };

//   const handleMinify = () => {
//     if (!validateJSON(input)) {
//       setError('Invalid JSON');
//       showNotification('Invalid JSON format', 'error');
//       return;
//     }
//     try {
//       const minified = minifyJSON(input);
//       setOutput(minified);
//       setError('');
//       showNotification('JSON minified successfully!', 'success');
//     } catch (err) {
//       setError(`Invalid JSON: ${err.message}`);
//       showNotification('Invalid JSON format', 'error');
//     }
//   };

//   const handleValidate = () => {
//     if (validateJSON(input)) {
//       setError('');
//       showNotification('JSON is valid!', 'success');
//     } else {
//       setError('Invalid JSON');
//       showNotification('Invalid JSON format', 'error');
//     }
//   };

//   const handleClear = () => {
//     setInput('');
//     setOutput('');
//     setError('');
//     setSearchTerm('');
//     setTreeView({});
//     showNotification('Cleared successfully!', 'info');
//   };

//   const copyToClipboard = async (text = output) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       showNotification('Copied to clipboard!', 'success');
//     } catch (err) {
//       showNotification('Failed to copy', 'error');
//     }
//   };

//   const downloadJSON = () => {
//     if (!output) return;
//     const blob = new Blob([output], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'formatted.json';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     showNotification('File downloaded!', 'success');
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setInput(e.target.result);
//       showNotification('File uploaded successfully!', 'success');
//     };
//     reader.readAsText(file);
//   };

//   const convertToXML = () => {
//     if (!validateJSON(input)) {
//       setError('Invalid JSON');
//       showNotification('Invalid JSON format', 'error');
//       return;
//     }
//     try {
//       const parsed = parseJSON(input);
//       const xml = jsonToXML(parsed);
//       console.log(xml);
//       setOutput(xml);
//       showNotification('Converted to XML!', 'success');
//     } catch (err) {
//       setError(`Conversion failed: ${err.message}`);
//       showNotification('Conversion failed', 'error');
//     }
//   };

//   const convertToCSV = () => {
//     if (!validateJSON(input)) {
//       setError('Invalid JSON');
//       showNotification('Invalid JSON format', 'error');
//       return;
//     }
//     try {
//       const parsed = parseJSON(input);
//       const csv = jsonToCSV(parsed);
//       setOutput(csv);
//       showNotification('Converted to CSV!', 'success');
//     } catch (err) {
//       setError(`Conversion failed: ${err.message}`);
//       showNotification('Conversion failed', 'error');
//     }
//   };
//   const jsonToXML = (obj, rootName = 'root') => {
//     let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`;

//     const convertValue = (value, key) => {
//       if (Array.isArray(value)) {
//         return value.map(item => `<${key}>${typeof item === 'object' ? convertObject(item) : item}</${key}>`).join('');
//       } else if (typeof value === 'object' && value !== null) {
//         return `<${key}>${convertObject(value)}</${key}>`;
//       } else {
//         return `<${key}>${value}</${key}>`;
//       }
//     };

//     const convertObject = (obj) => {
//       return Object.entries(obj).map(([key, value]) => convertValue(value, key)).join('');
//     };

//     xml += convertObject(obj);
//     xml += `</${rootName}>`;
//     return xml;
//   };

//   const jsonToCSV = (json) => {
//     let data = Array.isArray(json) ? json : [json];

//     const flattenObject = (obj, prefix = '') => {
//       let flat = {};
//       Object.keys(obj).forEach(key => {
//         const value = obj[key];
//         const newKey = prefix ? `${prefix}.${key}` : key;
//         if (typeof value === 'object' && value !== null) {
//           Object.assign(flat, flattenObject(value, newKey));
//         } else {
//           flat[newKey] = value;
//         }
//       });
//       return flat;
//     };

//     const flattenedData = data.map(flattenObject);
//     const headers = [...new Set(flattenedData.flatMap(Object.keys))];

//     const csvRows = flattenedData.map(row =>
//       headers.map(header => {
//         const value = row[header];
//         return value == null ? '' : typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
//       }).join(',')
//     );

//     return [headers.join(','), ...csvRows].join('\n');
//   };

//   const toggleTreeNode = (path) => {
//     setTreeView(prev => ({ ...prev, [path]: !prev[path] }));
//   };

//   const renderTreeView = (obj, path = '', depth = 0) => {
//     if (typeof obj !== 'object' || obj === null) {
//       let value = typeof obj === 'string' ? `"${obj}"` : String(obj);
//       if (typeof obj === 'bigint') value = `${obj}n`;
//       const highlighted = searchTerm && value.toLowerCase().includes(searchTerm.toLowerCase())
//         ? value.replace(new RegExp(`(${searchTerm})`, 'gi'), '<mark>$1</mark>')
//         : value;

//       return (
//         <span
//           className={`tree-value tree-value-${typeof obj}`}
//           dangerouslySetInnerHTML={{ __html: highlighted }}
//         />
//       );
//     }

//     const isExpanded = treeView[path] ?? true; // Default to expanded
//     const isArray = Array.isArray(obj);
//     const entries = isArray ? obj.map((value, index) => [index, value]) : Object.entries(obj);

//     return (
//       <div className="tree-node" style={{ marginLeft: `${depth * 0.5}rem` }}>
//         <div className="tree-toggle" onClick={() => toggleTreeNode(path)}>
//           {isExpanded ? <ChevronDown className="tree-icon" /> : <ChevronRight className="tree-icon" />}
//           <span className="tree-bracket">{isArray ? '[' : '{'}</span>
//           <span className="tree-count">
//             {entries.length} {entries.length === 1 ? (isArray ? 'element' : 'property') : (isArray ? 'elements' : 'properties')}
//           </span>
//         </div>
//         {isExpanded && (
//           <div className="tree-children">
//             {entries.map(([key, value], idx) => {
//               const keyStr = isArray ? key : `"${key}"`;
//               const highlightedKey = searchTerm && String(key).toLowerCase().includes(searchTerm.toLowerCase())
//                 ? keyStr.replace(new RegExp(`(${searchTerm})`, 'gi'), '<mark>$1</mark>')
//                 : keyStr;

//               return (
//                 <div key={`${path}-${key}`} className="tree-entry">
//                   <span
//                     className={`tree-key ${isArray ? 'tree-key-array' : ''}`}
//                     dangerouslySetInnerHTML={{ __html: highlightedKey }}
//                   />
//                   <span className="tree-colon">: </span>
//                   {renderTreeView(value, `${path}.${key}`, depth + 1)}
//                   {idx < entries.length - 1 && <span className="tree-comma">,</span>}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//         {isExpanded && <span className="tree-bracket">{isArray ? ']' : '}'}</span>}
//       </div>
//     );
//   };


//   const addLineNumbers = (text) => {
//     if (!lineNumbers || !text) return text;
//     return text.split('\n').map((line, idx) =>
//       `<span class="line-number">${(idx + 1).toString().padStart(3, '0')}</span> ${line}`
//     ).join('\n');
//   };

//   const highlightSearch = (text) => {
//     if (!searchTerm || !text) return text;
//     const regex = new RegExp(`(${searchTerm})`, 'gi');
//     return text.replace(regex, '<mark>$1</mark>');
//   };

//   const highlightJSON = (json) => {
//     return json.replace(/(".*?")(:)|(\btrue\b|\bfalse\b)|(null)|(\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([{}[\],])/g, (match, p1, p2, p3, p4, p5, p6) => {
//       if (p1) return `<span class="json-key">${p1}</span>${p2 || ''}`;
//       if (p3) return `<span class="json-boolean">${match}</span>`;
//       if (p4) return `<span class="json-null">${match}</span>`;
//       if (p5) return `<span class="json-number">${match}</span>`;
//       if (p6) return `<span class="json-punct">${match}</span>`;
//       return match;
//     });
//   };

//   useEffect(() => {
//     if (input) {
//       const valid = validateJSON(input);
//       setIsValid(valid);
//       if (valid) {
//         setError('');
//         setStats(calculateStats(input));
//       } else {
//         setError('Invalid JSON syntax');
//         setStats({ size: 0, lines: 0, keys: 0 });
//       }
//     } else {
//       setError('');
//       setIsValid(true);
//       setStats({ size: 0, lines: 0, keys: 0 });
//     }
//   }, [input, bigNumbers]);

//   return (
//     <div className={`json-tool-container ${isDarkMode ? 'dark' : 'light'} ${isFullscreen ? 'fullscreen' : ''}`}>
//       <style>{`
//                 /* Global Styles */
//                 .json-tool-container {
//                     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//                     min-height: 100vh;
//                     padding: 1rem;
//                     transition: all 0.3s ease;
//                     border-radius: 1.25rem;
//                     position: relative;
//                     display: flex;
//                     flex-direction: column;
//                 }

//                 .json-tool-container.fullscreen {
//                     position: fixed;
//                     top: 0;
//                     left: 0;
//                     right: 0;
//                     bottom: 0;
//                     z-index: 9999;
//                     padding: 1rem;
//                     border-radius: 0;
//                     margin: 0;
//                 }

//                 .json-tool-container.dark {
//                     background: linear-gradient(135deg, #232730 0%, #15181f 100%);
//                     color: #e2e8f0;
//                 }

//                 .json-tool-container.light {
//                     background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
//                     color: #1e293b;
//                 }

//                 /* Notification Styles */
//                 .notification {
//                     position: fixed;
//                     top: 1rem;
//                     right: 1rem;
//                     z-index: 1000;
//                     padding: 1rem 1.5rem;
//                     border-radius: 0.75rem;
//                     box-shadow: 0 20px 40px rgba(0,0,0,0.3);
//                     color: white;
//                     font-weight: 500;
//                     display: flex;
//                     align-items: center;
//                     gap: 0.5rem;
//                     animation: slideIn 0.3s ease;
//                     backdrop-filter: blur(10px);
//                 }

//                 @keyframes slideIn {
//                     from { transform: translateX(100%); opacity: 0; }
//                     to { transform: translateX(0); opacity: 1; }
//                 }

//                 .notification.success { 
//                     background: linear-gradient(135deg, #10b981 0%, #059669 100%);
//                 }
//                 .notification.error { 
//                     background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
//                 }
//                 .notification.info { 
//                     background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
//                 }

//                 /* Header Styles */
//                 .header {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     margin-bottom: 1rem;
//                     flex-wrap: wrap;
//                     gap: 1rem;
//                     padding: 1rem;
//                     border-radius: 1rem;
//                     backdrop-filter: blur(10px);
//                     box-shadow: 0 8px 32px rgba(0,0,0,0.1);
//                 }

//                 .json-tool-container.dark .header {
//                     background: rgba(35, 39, 48, 0.8);
//                     border: 1px solid rgba(47, 51, 64, 0.3);
//                 }

//                 .json-tool-container.light .header {
//                     background: rgba(255, 255, 255, 0.8);
//                     border: 1px solid rgba(226, 232, 240, 0.3);
//                 }

//                 .title {
//                     font-size: 2rem;
//                     font-weight: bold;
//                     background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
//                     -webkit-background-clip: text;
//                     -webkit-text-fill-color: transparent;
//                     margin: 0;
//                     text-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
//                 }

//                 .subtitle {
//                     color: #64748b;
//                     margin: 0.5rem 0 0 0;
//                     font-size: 1rem;
//                 }

//                 .header-controls {
//                     display: flex;
//                     align-items: center;
//                     gap: 1rem;
//                     flex-wrap: wrap;
//                 }

//                 /* Stats Styles */
//                 .stats {
//                     display: grid;
//                     grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//                     gap: 1rem;
//                     margin-bottom: 1rem;
//                     padding: 1rem;
//                     border-radius: 1rem;
//                     backdrop-filter: blur(10px);
//                     box-shadow: 0 8px 32px rgba(0,0,0,0.1);
//                 }

//                 .json-tool-container.dark .stats {
//                     background: rgba(35, 39, 48, 0.8);
//                     border: 1px solid rgba(47, 51, 64, 0.3);
//                 }

//                 .json-tool-container.light .stats {
//                     background: rgba(255, 255, 255, 0.8);
//                     border: 1px solid rgba(226, 232, 240, 0.3);
//                 }

//                 .stat-item {
//                     text-align: center;
//                     padding: 0.75rem;
//                     border-radius: 0.75rem;
//                     transition: transform 0.2s ease;
//                 }

//                 .stat-item:hover {
//                     transform: translateY(-2px);
//                 }

//                 .json-tool-container.dark .stat-item {
//                     background: rgba(21, 24, 31, 0.5);
//                 }

//                 .json-tool-container.light .stat-item {
//                     background: rgba(248, 250, 252, 0.8);
//                 }

//                 .stat-value {
//                     font-size: 1.5rem;
//                     font-weight: bold;
//                     margin-bottom: 0.25rem;
//                     text-shadow: 0 0 20px currentColor;
//                 }

//                 .stat-value.blue { color: #3b82f6; }
//                 .stat-value.green { color: #10b981; }
//                 .stat-value.purple { color: #8b5cf6; }
//                 .stat-value.red { color: #ef4444; }

//                 .stat-label {
//                     font-size: 0.875rem;
//                     color: #64748b;
//                     font-weight: 500;
//                 }

//                 /* Middle Controls Styles */
//                 .middle-controls {
//                     padding: 1rem;
//                     border-radius: 1rem;
//                     backdrop-filter: blur(10px);
//                     box-shadow: 0 8px 32px rgba(0,0,0,0.1);
//                     display: flex;
//                     flex-direction: column;
//                     gap: 1rem;
//                     min-width: 180px;
//                 }

//                 .json-tool-container.dark .middle-controls {
//                     background: rgba(35, 39, 48, 0.8);
//                     border: 1px solid rgba(47, 51, 64, 0.3);
//                 }

//                 .json-tool-container.light .middle-controls {
//                     background: rgba(255, 255, 255, 0.8);
//                     border: 1px solid rgba(226, 232, 240, 0.3);
//                 }

//                 .controls-group {
//                     display: flex;
//                     flex-direction: column;
//                     gap: 0.5rem;
//                     align-items: stretch;
//                 }

//                 .controls-divider {
//                     width: 100%;
//                     height: 1px;
//                     background-color: rgba(100, 116, 139, 0.3);
//                     margin: 0.5rem 0;
//                 }

//                 .btn {
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     gap: 0.5rem;
//                     padding: 0.75rem;
//                     border-radius: 0.75rem;
//                     font-weight: 500;
//                     cursor: pointer;
//                     border: none;
//                     transition: all 0.2s ease;
//                     font-size: 0.875rem;
//                     backdrop-filter: blur(10px);
//                     position: relative;
//                     overflow: hidden;
//                 }

//                 .btn::before {
//                     content: '';
//                     position: absolute;
//                     top: 0;
//                     left: -100%;
//                     width: 100%;
//                     height: 100%;
//                     background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
//                     transition: left 0.5s;
//                 }

//                 .btn:hover::before {
//                     left: 100%;
//                 }

//                 .btn:hover:not(:disabled) {
//                     transform: translateY(-2px);
//                     box-shadow: 0 8px 25px rgba(0,0,0,0.2);
//                 }

//                 .btn:disabled {
//                     opacity: 0.5;
//                     cursor: not-allowed;
//                 }

//                 .btn-primary {
//                     background: linear-gradient(135deg, #3b82f6, #2563eb);
//                     color: white;
//                     box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
//                 }

//                 .btn-secondary {
//                     background: linear-gradient(135deg, #64748b, #475569);
//                     color: white;
//                     box-shadow: 0 4px 15px rgba(100, 116, 139, 0.3);
//                 }

//                 .btn-danger {
//                     background: linear-gradient(135deg, #ef4444, #dc2626);
//                     color: white;
//                     box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
//                 }

//                 .btn-success {
//                     background: linear-gradient(135deg, #10b981, #059669);
//                     color: white;
//                     box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
//                 }

//                 .btn-warning {
//                     background: linear-gradient(135deg, #f59e0b, #d97706);
//                     color: white;
//                     box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
//                 }

//                 .btn-toggle {
//                     border: 2px solid #64748b;
//                     background: rgba(100, 116, 139, 0.1);
//                     backdrop-filter: blur(10px);
//                 }

//                 .json-tool-container.dark .btn-toggle {
//                     color: #e2e8f0;
//                 }

//                 .json-tool-container.light .btn-toggle {
//                     color: #1e293b;
//                 }

//                 .btn-toggle:hover:not(:disabled) {
//                     border-color: #3b82f6;
//                     background: rgba(59, 130, 246, 0.1);
//                 }

//                 .btn-toggle.active {
//                     background: linear-gradient(135deg, #3b82f6, #2563eb);
//                     border-color: #2563eb;
//                     color: white;
//                     box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
//                 }

//                 .btn-toggle.active.green {
//                     background: linear-gradient(135deg, #10b981, #059669);
//                     border-color: #059669;
//                     box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
//                 }

//                 .file-input {
//                     position: absolute;
//                     opacity: 0;
//                     width: 0;
//                     height: 0;
//                 }

//                 .select, .input {
//                     padding: 0.5rem;
//                     border-radius: 0.5rem;
//                     border: 1px solid #64748b;
//                     font-size: 0.875rem;
//                     transition: all 0.2s ease;
//                     backdrop-filter: blur(10px);
//                     text-align: center;
//                 }

//                 .json-tool-container.dark .select, 
//                 .json-tool-container.dark .input {
//                     background: rgba(21, 24, 31, 0.8);
//                     color: #e2e8f0;
//                     border-color: #2f3340;
//                 }

//                 .json-tool-container.light .select, 
//                 .json-tool-container.light .input {
//                     background: rgba(255, 255, 255, 0.8);
//                     color: #1e293b;
//                     border-color: #d1d5db;
//                 }

//                 .select:focus, .input:focus {
//                     outline: none;
//                     border-color: #3b82f6;
//                     box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//                 }

//                 /* Main Layout Styles */
//                 .main-layout {
//                     display: grid;
//                     grid-template-columns: 1fr auto 1fr;
//                     gap: 1rem;
//                     flex: 1;
//                     min-height: 0;
//                 }

//                 @media (max-width: 1024px) {
//                     .main-layout {
//                         grid-template-columns: 1fr;
//                         height: auto;
//                     }
//                     .middle-controls {
//                         order: 2;
//                         flex-direction: row;
//                         flex-wrap: wrap;
//                         justify-content: center;
//                     }
//                     .controls-group {
//                         flex-direction: row;
//                         flex-wrap: wrap;
//                         justify-content: center;
//                     }
//                     .btn {
//                         flex: 1 1 45%;
//                     }
//                 }

//                 /* Panel Styles */
//                 .panel {
//                     display: flex;
//                     flex-direction: column;
//                     border-radius: 1rem;
//                     overflow: hidden;
//                     backdrop-filter: blur(10px);
//                     box-shadow: 0 8px 32px rgba(0,0,0,0.15);
//                     transition: transform 0.2s ease;
//                     min-height: 400px;
//                 }

//                 .panel:hover {
//                     transform: translateY(-2px);
//                 }

//                 .json-tool-container.dark .panel {
//                     background: rgba(35, 39, 48, 0.8);
//                     border: 1px solid rgba(47, 51, 64, 0.3);
//                 }

//                 .json-tool-container.light .panel {
//                     background: rgba(255, 255, 255, 0.8);
//                     border: 1px solid rgba(226, 232, 240, 0.3);
//                 }

//                 .panel-header {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     padding: 0.75rem 1rem;
//                     border-bottom: 1px solid;
//                     font-weight: 600;
//                     background: rgba(0, 0, 0, 0.1);
//                 }

//                 .json-tool-container.dark .panel-header {
//                     border-color: rgba(47, 51, 64, 0.3);
//                 }

//                 .json-tool-container.light .panel-header {
//                     border-color: rgba(226, 232, 240, 0.3);
//                 }

//                 .panel-title {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.5rem;
//                 }

//                 .status-badge {
//                     display: inline-flex;
//                     align-items: center;
//                     gap: 0.25rem;
//                     padding: 0.25rem 0.5rem;
//                     border-radius: 0.375rem;
//                     font-size: 0.75rem;
//                     font-weight: 500;
//                     color: white;
//                     backdrop-filter: blur(10px);
//                 }

//                 .status-badge.valid {
//                     background: linear-gradient(135deg, #10b981, #059669);
//                     box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
//                 }

//                 .status-badge.invalid {
//                     background: linear-gradient(135deg, #ef4444, #dc2626);
//                     box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
//                 }

//                 .panel-controls {
//                     display: flex;
//                     gap: 0.5rem;
//                 }

//                 /* Content Area Styles */
//                 .panel-content {
//                     flex: 1;
//                     display: flex;
//                     flex-direction: column;
//                     overflow: hidden;
//                 }

//                 .textarea, .output-area {
//                     flex: 1;
//                     padding: 1rem;
//                     font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
//                     font-size: 0.875rem;
//                     line-height: 1.5;
//                     border: none;
//                     outline: none;
//                     resize: none;
//                     overflow: auto;
//                     background: transparent;
//                 }

//                 .json-tool-container.dark .textarea, 
//                 .json-tool-container.dark .output-area {
//                     color: #e2e8f0;
//                 }

//                 .json-tool-container.light .textarea, 
//                 .json-tool-container.light .output-area {
//                     color: #1e293b;
//                 }

//                 .output-area pre {
//                     margin: 0;
//                     white-space: pre-wrap;
//                     word-wrap: break-word;
//                 }

//                 .line-number {
//                     color: #64748b;
//                     user-select: none;
//                     display: inline-block;
//                     min-width: 3em;
//                     text-align: right;
//                     padding-right: 1em;
//                 }

//                 .json-key { color: #f97316; }
//                 .json-boolean { color: #8b5cf6; }
//                 .json-null { color: #64748b; }
//                 .json-number { color: #3b82f6; }
//                 .json-punct { color: #94a3b8; }

//                 .empty-state {
//                     display: flex;
//                     flex-direction: column;
//                     align-items: center;
//                     justify-content: center;
//                     height: 100%;
//                     color: #64748b;
//                     text-align: center;
//                     padding: 2rem;
//                 }

//                 .empty-icon {
//                     font-size: 3rem;
//                     margin-bottom: 1rem;
//                     opacity: 0.5;
//                 }

//                 /* Error Styles */
//                 .error-message {
//                     display: flex;
//                     align-items: flex-start;
//                     gap: 0.5rem;
//                     padding: 1rem;
//                     background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
//                     border-top: 1px solid rgba(239, 68, 68, 0.3);
//                     color: #ef4444;
//                     font-size: 0.875rem;
//                     backdrop-filter: blur(10px);
//                 }

//                 /* Tree View Styles */
//                 .tree-node {
//                     margin: 0.25rem 0;
//                 }

//                 .tree-toggle {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.25rem;
//                     cursor: pointer;
//                     padding: 0.25rem 0.5rem;
//                     border-radius: 0.375rem;
//                     transition: all 0.2s ease;
//                     font-family: 'JetBrains Mono', monospace;
//                 }

//                 .tree-toggle:hover {
//                     background: rgba(59, 130, 246, 0.1);
//                 }

//                 .tree-icon {
//                     width: 1rem;
//                     height: 1rem;
//                     color: #3b82f6;
//                 }

//                 .tree-bracket {
//                     color: #94a3b8;
//                 }

//                 .tree-count {
//                     font-size: 0.75rem;
//                     color: #64748b;
//                     background: rgba(100, 116, 139, 0.1);
//                     padding: 0.125rem 0.375rem;
//                     border-radius: 0.25rem;
//                 }

//                 .tree-children {
//                     margin-left: 1rem;
//                     border-left: 1px dashed #64748b;
//                     padding-left: 0.75rem;
//                 }

//                 .tree-entry {
//                     display: flex;
//                     align-items: flex-start;
//                     margin: 0.25rem 0;
//                     font-family: 'JetBrains Mono', monospace;
//                 }

//                 .tree-key {
//                     color: #f97316;
//                     white-space: nowrap;
//                 }

//                 .tree-key-array {
//                     color: #8b5cf6;
//                 }

//                 .tree-colon {
//                     color: #94a3b8;
//                     margin: 0 0.25rem;
//                 }

//                 .tree-comma {
//                     color: #94a3b8;
//                     margin-left: 0.25rem;
//                 }

//                 .tree-value-string {
//                     color: #10b981;
//                 }

//                 .tree-value-number {
//                     color: #3b82f6;
//                 }

//                 .tree-value-boolean {
//                     color: #8b5cf6;
//                 }

//                 .tree-value-null {
//                     color: #64748b;
//                 }

//                 mark {
//                     background: rgba(251, 191, 36, 0.3);
//                     color: inherit;
//                     padding: 0.125rem 0.25rem;
//                     border-radius: 0.25rem;
//                 }

//                 /* Search Styles */
//                 .search-container {
//                     position: relative;
//                 }

//                 .search-input {
//                     padding-left: 2.25rem;
//                 }

//                 .search-icon {
//                     position: absolute;
//                     left: 0.75rem;
//                     top: 50%;
//                     transform: translateY(-50%);
//                     color: #64748b;
//                     width: 1rem;
//                     height: 1rem;
//                 }

//                 /* Checkbox Styles */
//                 .checkbox-group {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.5rem;
//                     cursor: pointer;
//                     padding: 0.5rem;
//                     border-radius: 0.375rem;
//                     transition: background-color 0.2s ease;
//                     font-size: 0.875rem;
//                 }

//                 .checkbox-group:hover {
//                     background: rgba(59, 130, 246, 0.1);
//                 }

//                 .checkbox {
//                     width: 1rem;
//                     height: 1rem;
//                     border-radius: 0.25rem;
//                     border: 2px solid #64748b;
//                     position: relative;
//                     transition: all 0.2s ease;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                 }

//                 .checkbox.checked {
//                     background: linear-gradient(135deg, #3b82f6, #2563eb);
//                     border-color: #2563eb;
//                 }

//                 .checkbox.checked::after {
//                     content: '✓';
//                     color: white;
//                     font-size: 0.75rem;
//                     font-weight: bold;
//                 }

//                 /* Footer Styles */
//                 .footer {
//                     text-align: center;
//                     margin-top: 2rem;
//                     padding: 1rem;
//                     color: #64748b;
//                     font-size: 0.875rem;
//                     border-top: 1px solid rgba(100, 116, 139, 0.2);
//                     background: rgba(0, 0, 0, 0.05);
//                     border-radius: 1rem;
//                     backdrop-filter: blur(10px);
//                 }

//                 /* Responsive Styles */
//                 @media (max-width: 768px) {
//                     .json-tool-container {
//                         padding: 0.5rem;
//                     }

//                     .header, .stats, .middle-controls {
//                         padding: 0.75rem;
//                     }

//                     .title {
//                         font-size: 1.5rem;
//                     }

//                     .stats {
//                         grid-template-columns: repeat(2, 1fr);
//                     }

//                     .panel-header {
//                         flex-direction: column;
//                         gap: 0.5rem;
//                     }

//                     .panel-controls {
//                         flex-wrap: wrap;
//                         justify-content: center;
//                     }
//                 }

//                 /* Scrollbar Styles */
//                 .textarea::-webkit-scrollbar,
//                 .output-area::-webkit-scrollbar {
//                     width: 6px;
//                     height: 6px;
//                 }

//                 .textarea::-webkit-scrollbar-track,
//                 .output-area::-webkit-scrollbar-track {
//                     background: rgba(100, 116, 139, 0.1);
//                     border-radius: 3px;
//                 }

//                 .textarea::-webkit-scrollbar-thumb,
//                 .output-area::-webkit-scrollbar-thumb {
//                     background: linear-gradient(135deg, #64748b, #475569);
//                     border-radius: 3px;
//                 }

//                 .textarea::-webkit-scrollbar-thumb:hover,
//                 .output-area::-webkit-scrollbar-thumb:hover {
//                     background: linear-gradient(135deg, #475569, #334155);
//                 }
//             `}</style>

//       {/* Notification */}
//       {notification && (
//         <div className={`notification ${notification.type}`}>
//           {notification.type === 'success' && <CheckCircle size={20} />}
//           {notification.type === 'error' && <AlertCircle size={20} />}
//           {notification.type === 'info' && <RefreshCw size={20} />}
//           <span>{notification.message}</span>
//         </div>
//       )}

//       {/* Header */}
//       <div className="header">
//         <div>
//           <h1 className="title">JSON Toolkit Pro</h1>
//           <p className="subtitle">Advanced JSON editor with formatting, validation, visualization & conversions</p>
//         </div>

//         <div className="header-controls">
//           <button
//             onClick={() => setIsFullscreen(!isFullscreen)}
//             className="btn btn-toggle"
//           >
//             {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//             {isFullscreen ? 'Exit' : 'Fullscreen'}
//           </button>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//             <Settings size={16} />
//             <select
//               value={indentSize}
//               onChange={(e) => setIndentSize(Number(e.target.value))}
//               className="select"
//               style={{ width: 'auto' }}
//             >
//               <option value={2}>2 Spaces</option>
//               <option value={4}>4 Spaces</option>
//               <option value={8}>8 Spaces</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="stats">
//         <div className="stat-item">
//           <div className="stat-value blue">{stats.size}</div>
//           <div className="stat-label">Bytes</div>
//         </div>
//         <div className="stat-item">
//           <div className="stat-value green">{stats.lines}</div>
//           <div className="stat-label">Lines</div>
//         </div>
//         <div className="stat-item">
//           <div className="stat-value purple">{stats.keys}</div>
//           <div className="stat-label">Properties</div>
//         </div>
//         <div className="stat-item">
//           <div className={`stat-value ${isValid ? 'green' : 'red'}`}>
//             {isValid ? '✓' : '✗'}
//           </div>
//           <div className="stat-label">Valid</div>
//         </div>
//       </div>

//       {/* Main Layout */}
//       <div className="main-layout">
//         {/* Input Panel */}
//         <div className="panel">
//           <div className="panel-header">
//             <div className="panel-title">
//               <h3 style={{ margin: 0 }}>Input JSON</h3>
//               {input && (
//                 <span className={`status-badge ${isValid ? 'valid' : 'invalid'}`}>
//                   {isValid ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
//                   {isValid ? 'Valid' : 'Invalid'}
//                 </span>
//               )}
//             </div>
//             <div className="panel-controls">
//               <button
//                 onClick={() => copyToClipboard(input)}
//                 disabled={!input}
//                 className="btn btn-secondary"
//                 style={{ padding: '0.5rem 0.75rem' }}
//               >
//                 <Copy size={14} />
//               </button>
//               <button
//                 onClick={() => setInput('')}
//                 disabled={!input}
//                 className="btn btn-danger"
//                 style={{ padding: '0.5rem 0.75rem' }}
//               >
//                 <RotateCcw size={14} />
//               </button>
//             </div>
//           </div>

//           <div className="panel-content">
//             <textarea
//               value={input}
//               onChange={handleInputChange}
//               placeholder="Paste or type your JSON here..."
//               className="textarea"
//               style={{ tabSize: indentSize }}
//             />

//             {error && (
//               <div className="error-message">
//                 <AlertCircle size={16} style={{ flexShrink: 0 }} />
//                 <span>{error}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Middle Controls */}
//         <div className="middle-controls">
//           <div className="controls-group">
//             <div className="search-container">
//               <Search className="search-icon" size={16} />
//               <input
//                 type="text"
//                 placeholder="Search JSON..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="input search-input"
//               />
//             </div>
//             <button
//               // onClick={() => setIsTreeMode(!isTreeMode)}
//               onClick={handleTreeViewFormat}
//               className={`btn btn-toggle ${isTreeMode ? 'active green' : ''}`}
//             >
//               <FileText size={16} />
//               Tree View
//             </button>
//           </div>

//           <div className="controls-divider"></div>

//           <div className="controls-group">
//             <div className="checkbox-group" onClick={() => setAutoUpdate(!autoUpdate)}>
//               <div className={`checkbox ${autoUpdate ? 'checked' : ''}`}></div>
//               <span>Auto Format</span>
//             </div>
//             <div className="checkbox-group" onClick={() => setBigNumbers(!bigNumbers)}>
//               <div className={`checkbox ${bigNumbers ? 'checked' : ''}`}></div>
//               <span>BigInt Support</span>
//             </div>
//             <div className="checkbox-group" onClick={() => setLineNumbers(!lineNumbers)}>
//               <div className={`checkbox ${lineNumbers ? 'checked' : ''}`}></div>
//               <span>Line Numbers</span>
//             </div>
//             <div className="checkbox-group" onClick={() => setSortKeys(!sortKeys)}>
//               <div className={`checkbox ${sortKeys ? 'checked' : ''}`}></div>
//               <span>Sort Keys</span>
//             </div>
//             <div className="checkbox-group" onClick={() => setEscapeUnicode(!escapeUnicode)}>
//               <div className={`checkbox ${escapeUnicode ? 'checked' : ''}`}></div>
//               <span>Escape Unicode</span>
//             </div>
//           </div>

//           <div className="controls-divider"></div>

//           <div className="controls-group">
//             <button onClick={handleFormat} disabled={!input || !isValid} className="btn btn-primary">
//               <Braces size={16} />
//               Format
//             </button>
//             <button onClick={handleMinify} disabled={!input || !isValid} className="btn btn-secondary">
//               <Brackets size={16} />
//               Minify
//             </button>
//             <button onClick={handleValidate} disabled={!input} className="btn btn-warning">
//               <CheckCircle size={16} />
//               Validate
//             </button>
//             <button onClick={convertToXML} disabled={!input || !isValid} className="btn btn-success">
//               <FileCode2 size={16} />
//               To XML
//             </button>
//             <button onClick={convertToCSV} disabled={!input || !isValid} className="btn btn-success">
//               <FileSpreadsheet size={16} />
//               To CSV
//             </button>
//             <label className="btn btn-success">
//               <Upload size={16} />
//               Upload
//               <input
//                 type="file"
//                 accept=".json,.txt"
//                 onChange={handleFileUpload}
//                 className="file-input"
//               />
//             </label>
//             <button onClick={handleClear} disabled={!input && !output} className="btn btn-danger">
//               <Trash2 size={16} />
//               Clear
//             </button>
//           </div>
//         </div>

//         {/* Output Panel */}
//         <div className="panel">
//           <div className="panel-header">
//             <div className="panel-title">
//               <h3 style={{ margin: 0 }}>Output</h3>
//               {output && (
//                 <span className="status-badge valid">
//                   <Zap size={12} />
//                   {isTreeMode ? 'Tree' : 'Text'}
//                 </span>
//               )}
//             </div>
//             <div className="panel-controls">
//               <button
//                 onClick={() => copyToClipboard()}
//                 disabled={!output}
//                 className="btn btn-secondary"
//                 style={{ padding: '0.5rem 0.75rem' }}
//               >
//                 <Copy size={14} />
//               </button>
//               <button
//                 onClick={downloadJSON}
//                 disabled={!output}
//                 className="btn btn-success"
//                 style={{ padding: '0.5rem 0.75rem' }}
//               >
//                 <Download size={14} />
//               </button>
//               <button
//                 onClick={() => setOutput('')}
//                 disabled={!output}
//                 className="btn btn-danger"
//                 style={{ padding: '0.5rem 0.75rem' }}
//               >
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           </div>

//           <div className="panel-content">
//             <div className="output-area">
//               {output ? (
//                 isTreeMode && !error && isValid ? (
//                   <div style={{ fontSize: '0.875rem' }}>
//                     {(() => {
//                       try {
//                         return renderTreeView(JSON.parse(output));
//                       } catch {
//                         return <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{addLineNumbers(output)}</pre>;
//                       }
//                     })()}
//                   </div>
//                 ) : (
//                   <pre
//                     style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
//                     dangerouslySetInnerHTML={{
//                       __html: searchTerm ? highlightSearch(addLineNumbers(output)) : addLineNumbers(output)
//                     }}
//                   />
//                 )
//               ) : (
//                 <div className="empty-state">
//                   <div className="empty-icon">⚡</div>
//                   <div>Formatted JSON will appear here</div>
//                   <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>
//                     Use Beautify, Minify, or any conversion tool
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="footer">
//         <p>
//           <strong>JSON Toolkit Pro</strong> - Professional JSON processing with advanced features for developers
//         </p>
//       </div>
//     </div>
//   );
// };

// export default JSONTool;



/* global BigInt */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Copy, AlertCircle, ChevronDown, ChevronRight,
  Download, Upload, Trash2, CheckCircle, Settings, RefreshCw,
  FileText, Code, Search, Zap, Maximize2, Minimize2, RotateCcw,
  Braces, Brackets, FileJson, FileSpreadsheet, FileCode
} from 'lucide-react';

const JSONTool = ({ isDarkMode = true, showNotification: externalShowNotification }) => {
  const [input, setInput] = useState('');
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

  const parseJSON = (jsonString) => {
    return JSON.parse(jsonString, (key, value) => {
      if (bigNumbers) {
        if (typeof value === 'string' && value.endsWith('n')) {
          return BigInt(value.slice(0, -1));
        } else if (typeof value === 'number' && !Number.isSafeInteger(value)) {
          return BigInt(value);
        }
      }
      return value;
    });
  };

  const stringifyJSON = (parsed, indent = indentSize) => {
    let replacer = (key, value) => typeof value === 'bigint' ? `${value}n` : value;
    let formatted = JSON.stringify(parsed, replacer, indent);

    if (sortKeys) {
      const sorted = sortObjectKeys(parsed);
      formatted = JSON.stringify(sorted, replacer, indent);
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
    const parsed = parseJSON(jsonString);
    return JSON.stringify(parsed, (key, value) => typeof value === 'bigint' ? `${value}n` : value);
  };

  const validateJSON = (jsonString) => {
    try {
      if (!jsonString.trim()) return true;
      parseJSON(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const calculateStats = (jsonString) => {
    try {
      const parsed = parseJSON(jsonString);
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
      if (validateJSON(value)) {
        try {
          const parsed = parseJSON(value);
          const formatted = stringifyJSON(parsed);
          setOutput(formatted);
          setError('');
        } catch (err) {
          setOutput('');
        }
      } else {
        setOutput('');
      }
    }
  };

  const handleTreeViewFormat = () => {
    setIsTreeMode(true);
    if (!validateJSON(input)) {
      setError('Invalid JSON');
      showNotification('Invalid JSON format', 'error');
      return;
    }
    try {
      const parsed = parseJSON(input);
      const formatted = stringifyJSON(parsed);
      setOutput(formatted);
      setError('');
      showNotification('JSON formatted successfully!', 'success');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      showNotification('Invalid JSON format', 'error');
    }
  };

  const handleFormat = () => {
    setIsTreeMode(false);
    if (!validateJSON(input)) {
      setError('Invalid JSON');
      showNotification('Invalid JSON format', 'error');
      return;
    }
    try {
      const parsed = parseJSON(input);
      const formatted = stringifyJSON(parsed);
      setOutput(formatted);
      setError('');
      showNotification('JSON formatted successfully!', 'success');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      showNotification('Invalid JSON format', 'error');
    }
  };

  const handleMinify = () => {
    if (!validateJSON(input)) {
      setError('Invalid JSON');
      showNotification('Invalid JSON format', 'error');
      return;
    }
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

  const handleValidate = () => {
    if (validateJSON(input)) {
      setError('');
      showNotification('JSON is valid!', 'success');
    } else {
      setError('Invalid JSON');
      showNotification('Invalid JSON format', 'error');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setSearchTerm('');
    setTreeView({});
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
    if (!validateJSON(input)) {
      setError('Invalid JSON');
      showNotification('Invalid JSON format', 'error');
      return;
    }
    try {
      const parsed = parseJSON(input);
      const xml = jsonToXML(parsed);
      setOutput(xml);
      showNotification('Converted to XML!', 'success');
    } catch (err) {
      setError(`Conversion failed: ${err.message}`);
      showNotification('Conversion failed', 'error');
    }
  };

  const jsonToXML = (obj, rootName = 'root') => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`;
    const escapeXML = (str) => str.replace(/[<>&'"]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return char;
      }
    });
    const convertValue = (value, key) => {
      const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
      if (Array.isArray(value)) {
        return value.map((item, index) => {
          const itemKey = `${safeKey}Item`;
          if (typeof item === 'object' && item !== null) {
            return `<${itemKey}>${convertObject(item)}</${itemKey}>`;
          } else {
            return `<${itemKey}>${escapeXML(String(item))}</${itemKey}>`;
          }
        }).join('');
      } else if (typeof value === 'object' && value !== null) {
        return `<${safeKey}>${convertObject(value)}</${safeKey}>`;
      } else {
        return `<${safeKey}>${escapeXML(String(value))}</${safeKey}>`;
      }
    };
    const convertObject = (obj) => {
      return Object.entries(obj).map(([key, value]) => convertValue(value, key)).join('');
    };
    xml += convertObject(obj);
    xml += `</${rootName}>`;
    return xml;
  };

  const convertToCSV = () => {
    if (!validateJSON(input)) {
      setError('Invalid JSON');
      showNotification('Invalid JSON format', 'error');
      return;
    }
    try {
      const parsed = parseJSON(input);
      const csv = jsonToCSV(parsed);
      setOutput(csv);
      showNotification('Converted to CSV!', 'success');
    } catch (err) {
      setError(`Conversion failed: ${err.message}`);
      showNotification('Conversion failed', 'error');
    }
  };

  const jsonToCSV = (json) => {
    let data = Array.isArray(json) ? json : [json];

    const flattenObject = (obj, prefix = '') => {
      let flat = {};
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          Object.assign(flat, flattenObject(value, newKey));
        } else {
          flat[newKey] = value;
        }
      });
      return flat;
    };

    const flattenedData = data.map(flattenObject);
    const headers = [...new Set(flattenedData.flatMap(Object.keys))];

    const csvRows = flattenedData.map(row =>
      headers.map(header => {
        const value = row[header];
        return value == null ? '' : typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    );

    return [headers.join(','), ...csvRows].join('\n');
  };

  const toggleTreeNode = (path) => {
    setTreeView(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTreeView = (obj, path = '', depth = 0) => {
    if (typeof obj !== 'object' || obj === null) {
      let valueType = typeof obj;
      let value = typeof obj === 'string' ? `"${obj}"` : String(obj);
      if (typeof obj === 'bigint') {
        value = `${obj}n`;
        valueType = 'bigint';
      } else if (obj === null) {
        value = 'null';
        valueType = 'null';
      } else if (valueType === 'boolean') {
        value = obj ? 'true' : 'false';
      }
      const highlighted = searchTerm && value.toLowerCase().includes(searchTerm.toLowerCase())
        ? value.replace(new RegExp(`(${searchTerm})`, 'gi'), '<mark>$1</mark>')
        : value;

      return (
        <span
          className={`tree-value tree-value-${valueType}`}
          title={`Type: ${valueType}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    }

    const isExpanded = treeView[path] ?? true;
    const isArray = Array.isArray(obj);
    const entries = isArray ? obj.map((value, index) => [index.toString(), value]) : Object.entries(obj);

    const nodeType = isArray ? 'array' : 'object';
    const countLabel = entries.length === 1 ? (isArray ? 'element' : 'property') : (isArray ? 'elements' : 'properties');

    return (
      <div className="tree-node" style={{ marginLeft: `${depth * 1}rem`, position: 'relative' }}>
        <div
          className="tree-toggle"
          onClick={() => toggleTreeNode(path)}
          role="button"
          aria-expanded={isExpanded}
          aria-label={`Toggle ${nodeType} with ${entries.length} ${countLabel}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleTreeNode(path);
            }
          }}
        >
          {isExpanded ? <ChevronDown className="tree-icon" /> : <ChevronRight className="tree-icon" />}
          <span className="tree-type">{nodeType}</span>
          <span className="tree-count">({entries.length})</span>
        </div>
        {isExpanded && (
          <div className="tree-children">
            {entries.map(([key, value], idx) => {
              const keyStr = isArray ? key : `"${key}"`;
              const highlightedKey = searchTerm && key.toLowerCase().includes(searchTerm.toLowerCase())
                ? keyStr.replace(new RegExp(`(${searchTerm})`, 'gi'), '<mark>$1</mark>')
                : keyStr;

              return (
                <div key={`${path}-${key}`} className="tree-entry">
                  <span
                    className={`tree-key ${isArray ? 'tree-key-array' : ''}`}
                    dangerouslySetInnerHTML={{ __html: highlightedKey }}
                    title={`Key: ${key}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => copyToClipboard(key)}
                  />
                  {!isArray && <span className="tree-colon">: </span>}
                  {renderTreeView(value, `${path}.${key}`, depth + 1)}
                  {idx < entries.length - 1 && <span className="tree-comma">,</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const addLineNumbers = (text) => {
    if (!lineNumbers || !text) return text;
    return text.split('\n').map((line, idx) =>
      `<span class="line-number">${(idx + 1).toString().padStart(3, '0')}</span> ${line}`
    ).join('\n');
  };

  const highlightSearch = (text) => {
    if (!searchTerm || !text) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const highlightJSON = (json) => {
    return json.replace(/(".*?")(:)|(\btrue\b|\bfalse\b)|(null)|(\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([{}[\],])/g, (match, p1, p2, p3, p4, p5, p6) => {
      if (p1) return `<span class="json-key">${p1}</span>${p2 || ''}`;
      if (p3) return `<span class="json-boolean">${match}</span>`;
      if (p4) return `<span class="json-null">${match}</span>`;
      if (p5) return `<span class="json-number">${match}</span>`;
      if (p6) return `<span class="json-punct">${match}</span>`;
      return match;
    });
  };

  useEffect(() => {
    if (input) {
      const valid = validateJSON(input);
      setIsValid(valid);
      if (valid) {
        setError('');
        setStats(calculateStats(input));
      } else {
        setError('Invalid JSON syntax');
        setStats({ size: 0, lines: 0, keys: 0 });
      }
    } else {
      setError('');
      setIsValid(true);
      setStats({ size: 0, lines: 0, keys: 0 });
    }
  }, [input, bigNumbers]);

  return (
    <div className={`json-tool-container ${isDarkMode ? 'dark' : 'light'} ${isFullscreen ? 'fullscreen' : ''}`}>
      <style>{`
        /* Global Styles */
        .json-tool-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          // padding: 1rem;
          transition: all 0.3s ease;
          border-radius: 1.25rem;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        .json-tool-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          padding: 1rem;
          border-radius: 0;
          margin: 0;
        }
        
        .json-tool-container.dark {
          background: linear-gradient(135deg, #232730 0%, #15181f 100%);
          color: #e2e8f0;
        }
        
        .json-tool-container.light {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #1e293b;
        }

        /* Notification Styles */
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

        /* Header Styles */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .json-tool-container.dark .header {
          background: rgba(35, 39, 48, 0.8);
          border: 1px solid rgba(47, 51, 64, 0.3);
        }
        
        .json-tool-container.light .header {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.3);
        }
        
        .title {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
          text-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }

        .dark {
          color: #ffffff;
        }
         .light {
          color: #000000;
        }
        
        .subtitle {
          color: #64748b;
          margin: 0.5rem 0 0 0;
          font-size: 1rem;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Stats Styles */
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .json-tool-container.dark .stats {
          background: rgba(35, 39, 48, 0.8);
          border: 1px solid rgba(47, 51, 64, 0.3);
        }
        
        .json-tool-container.light .stats {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.3);
        }
        
        .stat-item {
          text-align: center;
          padding: 0.75rem;
          border-radius: 0.75rem;
          transition: transform 0.2s ease;
        }
        
        .stat-item:hover {
          transform: translateY(-2px);
        }
        
        .json-tool-container.dark .stat-item {
          background: rgba(21, 24, 31, 0.5);
        }
        
        .json-tool-container.light .stat-item {
          background: rgba(248, 250, 252, 0.8);
        }
        
        .stat-value {
          font-size: 1.5rem;
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

        /* Middle Controls Styles */
        .middle-controls {
          padding: 1rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 180px;
        }
        
        .json-tool-container.dark .middle-controls {
          background: rgba(35, 39, 48, 0.8);
          border: 1px solid rgba(47, 51, 64, 0.3);
        }
        
        .json-tool-container.light .middle-controls {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.3);
        }

        .controls-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: stretch;
        }

        .controls-divider {
          width: 100%;
          height: 1px;
          background-color: rgba(100, 116, 139, 0.3);
          margin: 0.5rem 0;
        }
        
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
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
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid #64748b;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
          text-align: center;
        }
        
        .json-tool-container.dark .select, 
        .json-tool-container.dark .input {
          background: rgba(21, 24, 31, 0.8);
          color: #e2e8f0;
          border-color: #2f3340;
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

        /* Main Layout Styles */
        .main-layout {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 1rem;
          flex: 1;
          min-height: 0;
        }
        
        @media (max-width: 1024px) {
          .main-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
          .middle-controls {
            order: 2;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .controls-group {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .btn {
            flex: 1 1 45%;
          }
        }

        /* Panel Styles */
        .panel {
          display: flex;
          flex-direction: column;
          border-radius: 1rem;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
          min-height: 400px;
        }
        
        .panel:hover {
          transform: translateY(-2px);
        }
        
        .json-tool-container.dark .panel {
          background: rgba(35, 39, 48, 0.8);
          border: 1px solid rgba(47, 51, 64, 0.3);
        }
        
        .json-tool-container.light .panel {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(226, 232, 240, 0.3);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.1);
        }
        
        .json-tool-container.dark .panel-header {
          border-color: rgba(47, 51, 64, 0.3);
        }
        
        .json-tool-container.light .panel-header {
          border-color: rgba(226, 232, 240, 0.3);
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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

        /* Content Area Styles */
        .panel-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .editor-container {
          position: relative;
          flex: 1;
          overflow: hidden;
        }

        .highlight-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 1rem;
          font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
          pointer-events: none;
          overflow: auto;
          z-index: 0;
        }

        .textarea {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          background: transparent;
          color: transparent;
          caret-color: currentColor;
          overflow: auto;
          padding: 1rem;
          font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          border: none;
          outline: none;
          resize: none;
        }

        .textarea::placeholder {
          color: #64748b;
          opacity: 0.5;
        }

        .output-area {
          flex: 1;
          padding: 1rem;
          font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          overflow: auto;
          background: transparent;
        }
        
        .json-tool-container.dark .output-area {
          color: #e2e8f0;
        }
        
        .json-tool-container.light .output-area {
          color: #1e293b;
        }

        .output-area pre {
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .line-number {
          color: #64748b;
          user-select: none;
          display: inline-block;
          min-width: 3em;
          text-align: right;
          padding-right: 1em;
        }

        .json-key { color: #f97316; }
        .json-boolean { color: #8b5cf6; }
        .json-null { color: #64748b; }
        .json-number { color: #3b82f6; }
        .json-punct { color: #94a3b8; }

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

        /* Error Styles */
        .error-message {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
          border-top: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          font-size: 0.875rem;
          backdrop-filter: blur(10px);
        }

        /* Tree View Styles */
        .tree-node {
          margin: 0.25rem 0;
        }

        .tree-toggle {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .tree-toggle:hover {
          background: rgba(59, 130, 246, 0.1);
        }

        .tree-icon {
          width: 1rem;
          height: 1rem;
          color: #3b82f6;
        }

        .tree-type {
          color: #94a3b8;
        }

        .tree-count {
          font-size: 0.75rem;
          color: #64748b;
        }

        .tree-children {
          margin-left: 1rem;
          border-left: 1px dashed #64748b;
          padding-left: 0.75rem;
        }

        .tree-entry {
          display: flex;
          align-items: flex-start;
          margin: 0.25rem 0;
          font-family: 'JetBrains Mono', monospace;
        }

        .tree-key {
          color: #f97316;
          white-space: nowrap;
        }

        .tree-key-array {
          color: #8b5cf6;
        }

        .tree-colon {
          color: #94a3b8;
          margin: 0 0.25rem;
        }

        .tree-comma {
          color: #94a3b8;
          margin-left: 0.25rem;
        }

        .tree-value-string {
          color: #10b981;
        }

        .tree-value-number, .tree-value-bigint {
          color: #3b82f6;
        }

        .tree-value-boolean {
          color: #8b5cf6;
        }

        .tree-value-null {
          color: #64748b;
        }

        mark {
          background: rgba(251, 191, 36, 0.3);
          color: inherit;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }

        /* Search Styles */
        .search-container {
          position: relative;
        }
        
        .search-input {
          padding-left: 2.25rem;
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

        /* Checkbox Styles */
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease;
          font-size: 0.875rem;
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
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .checkbox.checked {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-color: #2563eb;
        }
        
        .checkbox.checked::after {
          content: '✓';
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
        }

        /* Footer Styles */
        .footer {
          text-align: center;
          margin-top: 2rem;
          padding: 1rem;
          color: #64748b;
          font-size: 0.875rem;
          border-top: 1px solid rgba(100, 116, 139, 0.2);
          background: rgba(0, 0, 0, 0.05);
          border-radius: 1rem;
          backdrop-filter: blur(10px);
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .json-tool-container {
            padding: 0.5rem;
          }
          
          .header, .stats, .middle-controls {
            padding: 0.75rem;
          }
          
          .title {
            font-size: 1.5rem;
          }
          
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .panel-header {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .panel-controls {
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        /* Scrollbar Styles */
        .editor-container::-webkit-scrollbar,
        .textarea::-webkit-scrollbar,
        .highlight-overlay::-webkit-scrollbar,
        .output-area::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .editor-container::-webkit-scrollbar-track,
        .textarea::-webkit-scrollbar-track,
        .highlight-overlay::-webkit-scrollbar-track,
        .output-area::-webkit-scrollbar-track {
          background: rgba(100, 116, 139, 0.1);
          border-radius: 3px;
        }
        
        .editor-container::-webkit-scrollbar-thumb,
        .textarea::-webkit-scrollbar-thumb,
        .highlight-overlay::-webkit-scrollbar-thumb,
        .output-area::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #64748b, #475569);
          border-radius: 3px;
        }
        
        .editor-container::-webkit-scrollbar-thumb:hover,
        .textarea::-webkit-scrollbar-thumb:hover,
        .highlight-overlay::-webkit-scrollbar-thumb:hover,
        .output-area::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #475569, #334155);
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' && <CheckCircle size={20} />}
          {notification.type === 'error' && <AlertCircle size={20} />}
          {notification.type === 'info' && <RefreshCw size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="header">
        <div>
          <h1 className={`title ${isDarkMode ? 'dark' : 'light'}`}>JSON Toolkit</h1>
          {/* <p className="subtitle">Advanced JSON editor with formatting, validation, visualization & conversions</p> */}
        </div>

        <div className="header-controls">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn btn-toggle"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={16} />
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="select"
              style={{ width: 'auto' }}
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={8}>8 Spaces</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="stats">
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
          <div className="stat-label">Properties</div>
        </div>
        <div className="stat-item">
          <div className={`stat-value ${isValid ? 'green' : 'red'}`}>
            {isValid ? '✓' : '✗'}
          </div>
          <div className="stat-label">Valid</div>
        </div>
      </div> */}

      {/* Main Layout */}
      <div className="main-layout">
        {/* Input Panel */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <h3 style={{ margin: 0 }}>Input JSON</h3>
              {input && (
                <span className={`status-badge ${isValid ? 'valid' : 'invalid'}`}>
                  {isValid ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                  {isValid ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
            <div className="panel-controls">
              <button
                onClick={() => copyToClipboard(input)}
                disabled={!input}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <Copy size={14} />
              </button>
              <button
                onClick={() => setInput('')}
                disabled={!input}
                className="btn btn-danger"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="panel-content">
            <div className="editor-container">
              <pre className="highlight-overlay" dangerouslySetInnerHTML={{ __html: highlightJSON(highlightSearch(input)) }} />
              <textarea
                className="textarea"
                value={input}
                onChange={handleInputChange}
                placeholder="Paste or type your JSON here..."
                style={{
                  color: 'transparent',
                  background: 'transparent',
                  caretColor: isDarkMode ? '#e2e8f0' : '#1e293b',
                }}
              />
            </div>
            {error && (
              <div className="error-message">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Middle Controls */}
        <div className="middle-controls">
          <div className="controls-group">
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search JSON..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input search-input"
              />
            </div>
            <button
              onClick={handleTreeViewFormat}
              className={`btn btn-toggle ${isTreeMode ? 'active green' : ''}`}
            >
              <FileText size={16} />
              Tree View
            </button>
          </div>

          <div className="controls-divider"></div>

          <div className="controls-group">
            <div className="checkbox-group" onClick={() => setAutoUpdate(!autoUpdate)}>
              <div className={`checkbox ${autoUpdate ? 'checked' : ''}`}></div>
              <span>Auto Format</span>
            </div>
            <div className="checkbox-group" onClick={() => setBigNumbers(!bigNumbers)}>
              <div className={`checkbox ${bigNumbers ? 'checked' : ''}`}></div>
              <span>BigInt Support</span>
            </div>
            <div className="checkbox-group" onClick={() => setLineNumbers(!lineNumbers)}>
              <div className={`checkbox ${lineNumbers ? 'checked' : ''}`}></div>
              <span>Line Numbers</span>
            </div>
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
            <button onClick={handleFormat} disabled={!input || !isValid} className="btn btn-primary">
              <Braces size={16} />
              Format
            </button>
            <button onClick={handleMinify} disabled={!input || !isValid} className="btn btn-secondary">
              <Brackets size={16} />
              Minify
            </button>
            <button onClick={handleValidate} disabled={!input} className="btn btn-warning">
              <CheckCircle size={16} />
              Validate
            </button>
            <button onClick={convertToXML} disabled={!input || !isValid} className="btn btn-success">
              <FileCode size={16} />
              To XML
            </button>
            <button onClick={convertToCSV} disabled={!input || !isValid} className="btn btn-success">
              <FileSpreadsheet size={16} />
              To CSV
            </button>
            <label className="btn btn-success">
              <Upload size={16} />
              Upload
              <input
                type="file"
                accept=".json,.txt"
                onChange={handleFileUpload}
                className="file-input"
              />
            </label>
            <button onClick={handleClear} disabled={!input && !output} className="btn btn-danger">
              <Trash2 size={16} />
              Clear
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <h3 style={{ margin: 0 }}>Output</h3>
              {output && (
                <span className="status-badge valid">
                  <Zap size={12} />
                  {isTreeMode ? 'Tree' : 'Text'}
                </span>
              )}
            </div>
            <div className="panel-controls">
              <button
                onClick={() => copyToClipboard()}
                disabled={!output}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <Copy size={14} />
              </button>
              <button
                onClick={downloadJSON}
                disabled={!output}
                className="btn btn-success"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => setOutput('')}
                disabled={!output}
                className="btn btn-danger"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="panel-content">
            <div className="output-area">
              {output ? (
                isTreeMode && !error && isValid ? (
                  <div style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                    {(() => {
                      try {
                        return renderTreeView(parseJSON(output));
                      } catch {
                        return (
                          <pre
                            dangerouslySetInnerHTML={{
                              __html: highlightSearch(addLineNumbers(highlightJSON(output)))
                            }}
                          />
                        );
                      }
                    })()}
                  </div>
                ) : (
                  <pre
                    dangerouslySetInnerHTML={{
                      __html: highlightSearch(addLineNumbers(highlightJSON(output)))
                    }}
                  />
                )
              ) : (
                <div className="empty-state">
                  {/* <div className="empty-icon">⚡</div>
                  <div>Output will appear here</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>
                    Format, minify, or convert your JSON
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="footer">
        <p>
          <strong>JSON Toolkit Pro</strong> - Professional JSON processing with advanced features for developers
        </p>
      </div> */}
    </div>
  );
};

export default JSONTool;