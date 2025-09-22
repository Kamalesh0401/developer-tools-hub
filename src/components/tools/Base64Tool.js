// import React, { useState, useEffect } from 'react';
// import { Copy, Upload, Download, FileText, Image } from 'lucide-react';
// import { encodeBase64, decodeBase64, detectDataType } from '../../utils/base64Utils';
// import './Base64Tool.css';

// const Base64Tool = ({ isDarkMode, showNotification }) => {
//   const [input, setInput] = useState('Hello, World!');
//   const [output, setOutput] = useState('');
//   const [inputType, setInputType] = useState('text');
//   const [outputType, setOutputType] = useState('text');
//   const [lastOperation, setLastOperation] = useState('');

//   const handleEncode = () => {
//     try {
//       const encoded = encodeBase64(input);
//       setOutput(encoded);
//       setLastOperation('encode');
//       setOutputType('base64');
//       showNotification('Text encoded to Base64!', 'success');
//     } catch (err) {
//       showNotification('Failed to encode', 'error');
//     }
//   };

//   const handleDecode = () => {
//     try {
//       const decoded = decodeBase64(input);
//       setOutput(decoded);
//       setLastOperation('decode');
//       setOutputType('text');
//       showNotification('Base64 decoded successfully!', 'success');
//     } catch (err) {
//       showNotification('Invalid Base64 format', 'error');
//     }
//   };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(output);
//       showNotification('Copied to clipboard!', 'success');
//     } catch (err) {
//       showNotification('Failed to copy', 'error');
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const result = e.target.result;
//       if (file.type.startsWith('image/')) {
//         // For images, we want the base64 data URL
//         setInput(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
//         setInputType('image');
//       } else {
//         // For text files
//         setInput(result);
//         setInputType('text');
//       }
//       showNotification(`File "${file.name}" loaded successfully!`, 'success');
//     };

//     if (file.type.startsWith('image/')) {
//       reader.readAsDataURL(file);
//     } else {
//       reader.readAsText(file);
//     }
//   };

//   const downloadOutput = () => {
//     try {
//       const blob = new Blob([output], { type: 'text/plain' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${lastOperation === 'encode' ? 'encoded' : 'decoded'}_output.txt`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//       showNotification('File downloaded successfully!', 'success');
//     } catch (err) {
//       showNotification('Failed to download file', 'error');
//     }
//   };

//   const clearAll = () => {
//     setInput('');
//     setOutput('');
//     setInputType('text');
//     setOutputType('text');
//     setLastOperation('');
//     showNotification('All fields cleared!', 'info');
//   };

//   const swapInputOutput = () => {
//     const tempInput = input;
//     const tempType = inputType;
//     setInput(output);
//     setOutput(tempInput);
//     setInputType(outputType);
//     setOutputType(tempType);
//     setLastOperation(lastOperation === 'encode' ? 'decode' : 'encode');
//     showNotification('Input and output swapped!', 'info');
//   };

//   useEffect(() => {
//     if (input) {
//       const type = detectDataType(input);
//       setInputType(type);
//     }
//   }, [input]);

//   const isValidBase64 = (str) => {
//     try {
//       return btoa(atob(str)) === str;
//     } catch (err) {
//       return false;
//     }
//   };

//   const getInputIcon = () => {
//     switch (inputType) {
//       case 'image':
//         return <Image className="w-4 h-4" />;
//       case 'base64':
//         return <FileText className="w-4 h-4" />;
//       default:
//         return <FileText className="w-4 h-4" />;
//     }
//   };

//   return (
//     <div className={`base64-tool ${isDarkMode ? 'dark' : ''}`}>
//       <div className="title-section">
//         <h2>Base64 Encoder/Decoder</h2>
//         <p>Encode text to Base64 or decode Base64 to text</p>
//       </div>

//       <div className="top-buttons">
//         <button onClick={swapInputOutput} disabled={!input || !output}>⇄ Swap</button>
//         <button onClick={clearAll}>Clear All</button>
//       </div>

//       <div className="grid-container">
//         {/* Input Section */}
//         <div className="section">
//           <div className="section-header">
//             <span>
//               {getInputIcon()} Input
//               <span className={`tag ${inputType}`}>{inputType.toUpperCase()}</span>
//             </span>
//             <div>
//               <label className="upload-btn">
//                 <Upload /> Upload
//                 <input type="file" onChange={handleFileUpload} className="hidden" accept="text/*,image/*" />
//               </label>
//               <button onClick={handleEncode}>Encode</button>
//               <button onClick={handleDecode} disabled={!isValidBase64(input)}>Decode</button>
//             </div>
//           </div>

//           <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text or paste Base64 here..." />

//           {input && (
//             <div className="analysis">
//               <h4>Input Analysis</h4>
//               <div>Type: <span className="text-gray">{inputType}</span></div>
//               <div>Length: <span className="text-gray">{input.length} characters</span></div>
//               <div>Valid Base64: <span className={isValidBase64(input) ? 'text-green' : 'text-red'}>
//                 {isValidBase64(input) ? 'Yes' : 'No'}
//               </span></div>
//             </div>
//           )}
//         </div>

//         {/* Output Section */}
//         <div className="section">
//           <div className="section-header">
//             <span><FileText /> Output
//               {output && <span className={`tag ${outputType}`}>{outputType.toUpperCase()}</span>}
//             </span>
//             <div>
//               <button onClick={downloadOutput} disabled={!output}>Download</button>
//               <button onClick={copyToClipboard} disabled={!output}>Copy</button>
//             </div>
//           </div>

//           <div className="output-area">{output ? <pre>{output}</pre> : <div className="text-gray">Output will appear here</div>}</div>

//           {output && (
//             <div className="analysis">
//               <h4>Output Analysis</h4>
//               <div>Operation: <span className="text-gray">{lastOperation}</span></div>
//               <div>Length: <span className="text-gray">{output.length} characters</span></div>
//               <div>Size Difference: <span className={output.length > input.length ? 'text-red' : 'text-green'}>
//                 {output.length > input.length ? '+' : ''}{output.length - input.length} chars
//               </span></div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="base64-info">
//         <h3>About Base64</h3>
//         <p>• Base64 is a binary-to-text encoding scheme that represents binary data in ASCII.</p>
//         <p>• Each Base64 digit represents 6 bits of data using A-Z, a-z, 0-9, +, /.</p>
//         <p>• Base64 encoding increases the data size by ~33%.</p>
//         <p>• Commonly used in emails, data URLs, and web APIs.</p>
//       </div>
//     </div>
//   );
// };

// export default Base64Tool;

import React, { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Upload,
  Download,
  FileText,
  Image,
  Trash2,
  RefreshCw,
  ArrowLeftRight,
  CheckCircle,
  AlertCircle,
  Settings,
} from "lucide-react";

const Base64Tool = ({
  isDarkMode = true,
  showNotification: externalShowNotification,
}) => {
  const [input, setInput] = useState(
    "Hello, World! This is a sample text for Base64 encoding."
  );
  const [output, setOutput] = useState("");
  const [inputType, setInputType] = useState("text");
  const [outputType, setOutputType] = useState("text");
  const [lastOperation, setLastOperation] = useState("");
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    inputSize: 0,
    outputSize: 0,
    difference: 0,
  });
  const [isValid, setIsValid] = useState(true);

  const showNotification = useCallback(
    (message, type = "success") => {
      if (externalShowNotification) {
        externalShowNotification(message, type);
      } else {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
      }
    },
    [externalShowNotification]
  );

  const encodeBase64 = (text) => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      throw new Error("Failed to encode text");
    }
  };

  const decodeBase64 = (base64) => {
    try {
      return decodeURIComponent(escape(atob(base64)));
    } catch (error) {
      throw new Error("Invalid Base64 string");
    }
  };

  const detectDataType = useCallback((data) => {
    if (!data) return "text";

    // Check if it's valid Base64
    if (isValidBase64(data)) {
      return "base64";
    }

    // Check if it looks like an image data URL
    if (data.startsWith("data:image/")) {
      return "image";
    }

    return "text";
  }, []); // add dependencies if needed

  const isValidBase64 = (str) => {
    if (!str || str.length === 0) return false;

    try {
      // Check if it's a valid Base64 string
      const decoded = atob(str);
      const encoded = btoa(decoded);
      return encoded === str;
    } catch (err) {
      return false;
    }
  };

  const calculateStats = (input, output) => {
    const inputSize = new Blob([input]).size;
    const outputSize = new Blob([output]).size;
    const difference = outputSize - inputSize;
    return { inputSize, outputSize, difference };
  };

  const handleEncode = () => {
    try {
      const encoded = encodeBase64(input);
      setOutput(encoded);
      setLastOperation("encode");
      setOutputType("base64");
      setStats(calculateStats(input, encoded));
      showNotification("Text encoded to Base64 successfully!", "success");
    } catch (err) {
      showNotification("Failed to encode: " + err.message, "error");
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeBase64(input);
      setOutput(decoded);
      setLastOperation("decode");
      setOutputType("text");
      setStats(calculateStats(input, decoded));
      showNotification("Base64 decoded successfully!", "success");
    } catch (err) {
      showNotification("Failed to decode: Invalid Base64 format", "error");
    }
  };

  const copyToClipboard = async (text = output) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Copied to clipboard!", "success");
    } catch (err) {
      showNotification("Failed to copy", "error");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      if (file.type.startsWith("image/")) {
        // For images, we want the base64 data without the data URL prefix
        const base64Data = result.split(",")[1];
        setInput(base64Data);
        setInputType("image");
      } else {
        // For text files
        setInput(result);
        setInputType("text");
      }
      showNotification(`File "${file.name}" loaded successfully!`, "success");
    };

    if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const downloadOutput = () => {
    try {
      const blob = new Blob([output], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${
        lastOperation === "encode" ? "encoded" : "decoded"
      }_output.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification("File downloaded successfully!", "success");
    } catch (err) {
      showNotification("Failed to download file", "error");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setInputType("text");
    setOutputType("text");
    setLastOperation("");
    setStats({ inputSize: 0, outputSize: 0, difference: 0 });
    showNotification("All fields cleared!", "info");
  };

  const swapInputOutput = () => {
    if (!input || !output) return;

    const tempInput = input;
    const tempType = inputType;
    setInput(output);
    setOutput(tempInput);
    setInputType(outputType);
    setOutputType(tempType);
    setLastOperation(lastOperation === "encode" ? "decode" : "encode");
    showNotification("Input and output swapped!", "info");
  };

  const getInputIcon = () => {
    switch (inputType) {
      case "image":
        return <Image style={{ width: "1rem", height: "1rem" }} />;
      case "base64":
        return <Settings style={{ width: "1rem", height: "1rem" }} />;
      default:
        return <FileText style={{ width: "1rem", height: "1rem" }} />;
    }
  };

  useEffect(() => {
    if (input) {
      const type = detectDataType(input);
      setInputType(type);
      setIsValid(type === "base64" ? isValidBase64(input) : true);
    } else {
      setInputType("text");
      setIsValid(true);
    }
  }, [input, detectDataType]);

  return (
    <div className={`base64-tool-container ${isDarkMode ? "dark" : "light"}`}>
      <style>{`
        .base64-tool-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          padding: 2rem;
          transition: all 0.3s ease;
        }
        
        .base64-tool-container.dark {
          background-color: #0f172a;
          color: #e2e8f0;
        }
        
        .base64-tool-container.light {
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
          background: linear-gradient(90deg, #a78bfa, #f472b6);
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
        
        .base64-tool-container.dark .stats {
          background-color: #1e293b;
          border: 1px solid #334155;
        }
        
        .base64-tool-container.light .stats {
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
        .stat-value.orange { color: #f59e0b; }
        
        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
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
        
        .btn-warning {
          background-color: #f59e0b;
          color: white;
        }
        
        .btn-warning:hover:not(:disabled) {
          background-color: #d97706;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
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
        
        .base64-tool-container.dark .panel {
          background-color: #1e293b;
          border: 1px solid #334155;
        }
        
        .base64-tool-container.light .panel {
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
        
        .base64-tool-container.dark .panel-header {
          border-color: #334155;
          background-color: #0f172a;
        }
        
        .base64-tool-container.light .panel-header {
          border-color: #e2e8f0;
          background-color: #f8fafc;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .type-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
        }
        
        .type-tag.text {
          background-color: #6b7280;
        }
        
        .type-tag.base64 {
          background-color: #3b82f6;
        }
        
        .type-tag.image {
          background-color: #16a34a;
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
        
        .base64-tool-container.dark .textarea, 
        .base64-tool-container.dark .output-area {
          background-color: #0f172a;
          color: #e2e8f0;
        }
        
        .base64-tool-container.light .textarea, 
        .base64-tool-container.light .output-area {
          background-color: #f8fafc;
          color: #1e293b;
        }

        .output-area {
          min-height: 300px;
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

        /* Analysis */
        .analysis {
          padding: 1rem 1.5rem;
          border-top: 1px solid;
          font-size: 0.875rem;
        }
        
        .base64-tool-container.dark .analysis {
          border-color: #334155;
          background-color: rgba(30, 41, 59, 0.5);
        }
        
        .base64-tool-container.light .analysis {
          border-color: #e2e8f0;
          background-color: rgba(248, 250, 252, 0.8);
        }

        .analysis-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #3b82f6;
        }

        .analysis-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .analysis-label {
          color: #6b7280;
        }

        .analysis-value {
          font-weight: 500;
        }

        .analysis-value.gray { color: #6b7280; }
        .analysis-value.green { color: #16a34a; }
        .analysis-value.red { color: #dc2626; }
        .analysis-value.blue { color: #3b82f6; }

        /* Info Section */
        .info-section {
          margin-top: 2rem;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .base64-tool-container.dark .info-section {
          background-color: #1e293b;
          border: 1px solid #334155;
        }
        
        .base64-tool-container.light .info-section {
          background-color: white;
          border: 1px solid #e2e8f0;
        }

        .info-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #f59e0b;
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-item {
          margin-bottom: 0.5rem;
          color: #6b7280;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .info-item::before {
          content: "•";
          color: #f59e0b;
          font-weight: bold;
          margin-top: 0.125rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .base64-tool-container {
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
          {notification.type === "success" && (
            <CheckCircle style={{ width: "1.25rem", height: "1.25rem" }} />
          )}
          {notification.type === "error" && (
            <AlertCircle style={{ width: "1.25rem", height: "1.25rem" }} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="container">
        {/* Header */}
        <div className="header">
          <div>
            <h1 className="title">Base64 Tool</h1>
            <p className="subtitle">
              Encode text to Base64 or decode Base64 to text with advanced
              analysis
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-item">
            <div className="stat-value blue">{stats.inputSize}</div>
            <div className="stat-label">Input Bytes</div>
          </div>
          <div className="stat-item">
            <div className="stat-value green">{stats.outputSize}</div>
            <div className="stat-label">Output Bytes</div>
          </div>
          <div className="stat-item">
            <div
              className={`stat-value ${
                stats.difference > 0
                  ? "red"
                  : stats.difference < 0
                  ? "green"
                  : "purple"
              }`}
            >
              {stats.difference > 0 ? "+" : ""}
              {stats.difference}
            </div>
            <div className="stat-label">Difference</div>
          </div>
          <div className="stat-item">
            <div
              className={`stat-value ${
                inputType === "base64" ? (isValid ? "green" : "red") : "blue"
              }`}
            >
              {inputType === "base64"
                ? isValid
                  ? "✓"
                  : "✗"
                : inputType.charAt(0).toUpperCase() + inputType.slice(1)}
            </div>
            <div className="stat-label">Input Type</div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <button
            onClick={handleEncode}
            disabled={!input}
            className="btn btn-primary"
          >
            <RefreshCw style={{ width: "1rem", height: "1rem" }} />
            Encode
          </button>

          <button
            onClick={handleDecode}
            disabled={!input || !isValidBase64(input)}
            className="btn btn-secondary"
          >
            Decode
          </button>

          <button
            onClick={swapInputOutput}
            disabled={!input || !output}
            className="btn btn-warning"
          >
            <ArrowLeftRight style={{ width: "1rem", height: "1rem" }} />
            Swap
          </button>

          <button onClick={clearAll} className="btn btn-danger">
            <Trash2 style={{ width: "1rem", height: "1rem" }} />
            Clear All
          </button>

          <label className="btn btn-success">
            <Upload style={{ width: "1rem", height: "1rem" }} />
            Upload
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input"
              accept="text/*,image/*"
            />
          </label>
        </div>

        {/* Main Content - Input Left, Output Right */}
        <div className="main-layout">
          {/* Input Panel (Left) */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <h3>Input</h3>
                {getInputIcon()}
                <span className={`type-tag ${inputType}`}>
                  {inputType.toUpperCase()}
                </span>
                {inputType === "base64" && (
                  <span
                    className={`status-badge ${isValid ? "valid" : "invalid"}`}
                  >
                    {isValid ? (
                      <CheckCircle
                        style={{ width: "0.75rem", height: "0.75rem" }}
                      />
                    ) : (
                      <AlertCircle
                        style={{ width: "0.75rem", height: "0.75rem" }}
                      />
                    )}
                    {isValid ? "Valid" : "Invalid"}
                  </span>
                )}
              </div>
              <div className="panel-controls">
                <button
                  onClick={() => copyToClipboard(input)}
                  disabled={!input}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem", fontSize: "0.75rem" }}
                >
                  <Copy style={{ width: "0.875rem", height: "0.875rem" }} />
                </button>
              </div>
            </div>

            <div className="panel-content">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to encode or paste Base64 to decode..."
                className="textarea"
              />

              {input && (
                <div className="analysis">
                  <div className="analysis-title">Input Analysis</div>
                  <div className="analysis-item">
                    <span className="analysis-label">Type:</span>
                    <span className="analysis-value gray">{inputType}</span>
                  </div>
                  <div className="analysis-item">
                    <span className="analysis-label">Length:</span>
                    <span className="analysis-value gray">
                      {input.length} characters
                    </span>
                  </div>
                  <div className="analysis-item">
                    <span className="analysis-label">Size:</span>
                    <span className="analysis-value gray">
                      {stats.inputSize} bytes
                    </span>
                  </div>
                  {inputType === "base64" && (
                    <div className="analysis-item">
                      <span className="analysis-label">Valid Base64:</span>
                      <span
                        className={`analysis-value ${
                          isValid ? "green" : "red"
                        }`}
                      >
                        {isValid ? "Yes" : "No"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Output Panel (Right) */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <h3>Output</h3>
                <FileText style={{ width: "1rem", height: "1rem" }} />
                {output && (
                  <span className={`type-tag ${outputType}`}>
                    {outputType.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="panel-controls">
                <button
                  onClick={() => copyToClipboard()}
                  disabled={!output}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem", fontSize: "0.75rem" }}
                >
                  <Copy style={{ width: "0.875rem", height: "0.875rem" }} />
                </button>
                <button
                  onClick={downloadOutput}
                  disabled={!output}
                  className="btn btn-success"
                  style={{ padding: "0.5rem", fontSize: "0.75rem" }}
                >
                  <Download style={{ width: "0.875rem", height: "0.875rem" }} />
                </button>
              </div>
            </div>

            <div className="panel-content">
              <div className="output-area">
                {output ? (
                  <pre
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.6,
                    }}
                  >
                    {output}
                  </pre>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🔄</div>
                    <div>Encoded/Decoded result will appear here</div>
                    <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                      Use Encode or Decode buttons
                    </div>
                  </div>
                )}
              </div>

              {output && (
                <div className="analysis">
                  <div className="analysis-title">Output Analysis</div>
                  <div className="analysis-item">
                    <span className="analysis-label">Operation:</span>
                    <span className="analysis-value blue">{lastOperation}</span>
                  </div>
                  <div className="analysis-item">
                    <span className="analysis-label">Length:</span>
                    <span className="analysis-value gray">
                      {output.length} characters
                    </span>
                  </div>
                  <div className="analysis-item">
                    <span className="analysis-label">Size:</span>
                    <span className="analysis-value gray">
                      {stats.outputSize} bytes
                    </span>
                  </div>
                  <div className="analysis-item">
                    <span className="analysis-label">Size Change:</span>
                    <span
                      className={`analysis-value ${
                        stats.difference > 0
                          ? "red"
                          : stats.difference < 0
                          ? "green"
                          : "gray"
                      }`}
                    >
                      {stats.difference > 0 ? "+" : ""}
                      {stats.difference} bytes
                      {stats.difference !== 0 &&
                        ` (${(
                          (stats.difference / stats.inputSize) *
                          100
                        ).toFixed(1)}%)`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h3 className="info-title">About Base64 Encoding</h3>
          <ul className="info-list">
            <li className="info-item">
              Base64 is a binary-to-text encoding scheme that represents binary
              data in ASCII format
            </li>
            <li className="info-item">
              Uses characters A-Z, a-z, 0-9, plus (+), and slash (/) with
              optional padding (=)
            </li>
            <li className="info-item">
              Base64 encoding increases data size by approximately 33% due to
              the 6-bit to 8-bit conversion
            </li>
            <li className="info-item">
              Commonly used in email attachments, data URLs, web APIs, and
              embedding images in HTML/CSS
            </li>
            <li className="info-item">
              Every 3 bytes of input data produces exactly 4 characters of
              Base64 output
            </li>
            <li className="info-item">
              Safe for transmission over text-based protocols that may not
              handle binary data properly
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "3rem",
            paddingTop: "2rem",
            color: "#6b7280",
            fontSize: "0.875rem",
            borderTop: "1px solid #374151",
          }}
        >
          <p>
            Supports text encoding, decoding, file uploads, and comprehensive
            data analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default Base64Tool;
