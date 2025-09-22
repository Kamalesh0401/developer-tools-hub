// import React, { useState, useEffect } from 'react';
// import { Copy, AlertCircle, Key, User, Shield } from 'lucide-react';
// import { decodeJWT, validateJWT } from '../../utils/jwtUtils';
// import './JWTTool.css';

// const JWTTool = ({ isDarkMode, showNotification }) => {
//   const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
//   const [decodedHeader, setDecodedHeader] = useState('');
//   const [decodedPayload, setDecodedPayload] = useState('');
//   const [signature, setSignature] = useState('');
//   const [error, setError] = useState('');
//   const [tokenInfo, setTokenInfo] = useState(null);

//   const handleDecode = () => {
//     try {
//       const result = decodeJWT(token);
//       setDecodedHeader(JSON.stringify(result.header, null, 2));
//       setDecodedPayload(JSON.stringify(result.payload, null, 2));
//       setSignature(result.signature);
//       setTokenInfo(result.info);
//       setError('');
//       showNotification('JWT decoded successfully!', 'success');
//     } catch (err) {
//       setError(err.message);
//       setDecodedHeader('');
//       setDecodedPayload('');
//       setSignature('');
//       setTokenInfo(null);
//       showNotification('Invalid JWT token', 'error');
//     }
//   };

//   const copyToClipboard = async (content, section) => {
//     try {
//       await navigator.clipboard.writeText(content);
//       showNotification(`${section} copied to clipboard!`, 'success');
//     } catch (err) {
//       showNotification('Failed to copy', 'error');
//     }
//   };

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'Not provided';
//     const date = new Date(timestamp * 1000);
//     return date.toLocaleString();
//   };

//   const isTokenExpired = (exp) => {
//     if (!exp) return false;
//     return Date.now() >= exp * 1000;
//   };

//   useEffect(() => {
//     if (token) {
//       handleDecode();
//     }
//   }, []);

//   useEffect(() => {
//     if (token) {
//       try {
//         validateJWT(token);
//         setError('');
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//   }, [token]);

//   return (
//     <div className={`jwt-tool ${isDarkMode ? 'dark' : ''}`}>
//       <div className="title-section">
//         <h2>JWT Decoder</h2>
//         <p>Decode and analyze JSON Web Tokens</p>
//       </div>

//       <div className="input-section">
//         <div className="input-header">
//           <span>
//             <Key /> JWT Token
//             {!error && token && <span className="valid">✓ Valid JWT</span>}
//           </span>
//           <button onClick={handleDecode}>Decode</button>
//         </div>
//         <textarea value={token} onChange={e => setToken(e.target.value)} placeholder="Paste your JWT token here..." />
//         {token && (
//           <div className={`absolute top-2 right-2 ${error ? 'invalid' : 'valid'}`}>
//             {error ? 'Invalid' : 'Valid JWT'}
//           </div>
//         )}
//         {error && <div className="error-box"><AlertCircle /> <div className="error-text">{error}</div></div>}
//       </div>

//       {tokenInfo && (
//         <div className="token-info">
//           <h3><User /> Token Information</h3>
//           <div className="grid">
//             <div>Algorithm: <span>{tokenInfo.algorithm}</span></div>
//             <div>Type: <span>{tokenInfo.type}</span></div>
//             <div>Issued At: <span>{formatTimestamp(tokenInfo.iat)}</span></div>
//             <div>Expires At: <span>{formatTimestamp(tokenInfo.exp)}</span></div>
//             <div>Not Before: <span>{formatTimestamp(tokenInfo.nbf)}</span></div>
//             <div>Subject: <span>{tokenInfo.sub || 'Not provided'}</span></div>
//           </div>
//         </div>
//       )}

//       <div className="output-section">
//         <div className="section">
//           <div className="section-header">
//             <span><Shield /> Header</span>
//             <button className="header-btn" onClick={() => copyToClipboard(decodedHeader, 'Header')}>Copy</button>
//           </div>
//           <div className="section-content header">
//             {decodedHeader ? <pre>{decodedHeader}</pre> : <div className="placeholder">JWT header will appear here</div>}
//           </div>
//         </div>

//         <div className="section">
//           <div className="section-header">
//             <span><User /> Payload</span>
//             <button className="payload-btn" onClick={() => copyToClipboard(decodedPayload, 'Payload')}>Copy</button>
//           </div>
//           <div className="section-content payload">
//             {decodedPayload ? <pre>{decodedPayload}</pre> : <div className="placeholder">JWT payload will appear here</div>}
//           </div>
//         </div>

//         <div className="section">
//           <div className="section-header">
//             <span><Key /> Signature</span>
//             <button className="signature-btn" onClick={() => copyToClipboard(signature, 'Signature')}>Copy</button>
//           </div>
//           <div className="section-content signature">
//             {signature ? <pre>{signature}</pre> : <div className="placeholder">JWT signature will appear here</div>}
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default JWTTool;

import React, { useState, useEffect, useCallback } from "react";
import {
  Copy,
  AlertCircle,
  Key,
  User,
  Shield,
  Clock,
  CheckCircle,
  Trash2,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImF1ZCI6InRlc3QtYXVkaWVuY2UiLCJpc3MiOiJ0ZXN0LWlzc3VlciIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20ifQ.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wGJinnMsk

const JWTTool = ({
  isDarkMode = true,
  showNotification: externalShowNotification,
}) => {
  const [token, setToken] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [tokenInfo, setTokenInfo] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showSignature, setShowSignature] = useState(false);
  const [stats, setStats] = useState({
    headerSize: 0,
    payloadSize: 0,
    signatureSize: 0,
    totalSize: 0,
  });

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

  const decodeJWT = (token) => {
    if (!token) throw new Error("Token is required");

    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error(
        "Invalid JWT format. JWT must have three parts separated by dots."
      );
    }

    try {
      const header = JSON.parse(
        atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"))
      );
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      const signature = parts[2];

      // Extract common token information
      const info = {
        algorithm: header.alg || "Unknown",
        type: header.typ || "Unknown",
        iat: payload.iat,
        exp: payload.exp,
        nbf: payload.nbf,
        sub: payload.sub,
        aud: payload.aud,
        iss: payload.iss,
        jti: payload.jti,
      };

      return { header, payload, signature, info };
    } catch (err) {
      throw new Error("Failed to decode JWT: Invalid base64 encoding");
    }
  };

  const validateJWT = (token) => {
    if (!token.trim()) {
      throw new Error("Token cannot be empty");
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT structure");
    }

    // Basic validation
    parts.forEach((part, index) => {
      if (!part) {
        const partNames = ["header", "payload", "signature"];
        throw new Error(`JWT ${partNames[index]} is empty`);
      }
    });

    return true;
  };

  const calculateStats = (token) => {
    if (!token)
      return { headerSize: 0, payloadSize: 0, signatureSize: 0, totalSize: 0 };

    const parts = token.split(".");
    if (parts.length !== 3)
      return { headerSize: 0, payloadSize: 0, signatureSize: 0, totalSize: 0 };

    return {
      headerSize: parts[0].length,
      payloadSize: parts[1].length,
      signatureSize: parts[2].length,
      totalSize: token.length,
    };
  };

  const copyToClipboard = async (content, section) => {
    if (!content) {
      showNotification("Nothing to copy", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      showNotification(`${section} copied to clipboard!`, "success");
    } catch (err) {
      showNotification("Failed to copy", "error");
    }
  };

  const downloadJWT = () => {
    if (!decodedHeader || !decodedPayload) {
      showNotification("No JWT data to download", "error");
      return;
    }

    const jwtData = {
      token: token,
      header: JSON.parse(decodedHeader),
      payload: JSON.parse(decodedPayload),
      signature: signature,
      info: tokenInfo,
    };

    const blob = new Blob([JSON.stringify(jwtData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jwt-decoded.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("JWT data downloaded!", "success");
  };

  const clearAll = () => {
    setToken("");
    setDecodedHeader("");
    setDecodedPayload("");
    setSignature("");
    setError("");
    setTokenInfo(null);
    setStats({ headerSize: 0, payloadSize: 0, signatureSize: 0, totalSize: 0 });
    showNotification("All fields cleared!", "info");
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Not provided";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const isTokenExpired = (exp) => {
    if (!exp) return null;
    return Date.now() >= exp * 1000;
  };

  const getTimeUntilExpiry = (exp) => {
    if (!exp) return "No expiration";
    const now = Date.now();
    const expTime = exp * 1000;
    const diff = expTime - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  useEffect(() => {
    const handleDecode = () => {
      if (!token.trim()) {
        showNotification("Please enter a JWT token", "error");
        return;
      }

      try {
        const result = decodeJWT(token);
        setDecodedHeader(JSON.stringify(result.header, null, 2));
        setDecodedPayload(JSON.stringify(result.payload, null, 2));
        setSignature(result.signature);
        setTokenInfo(result.info);
        setStats(calculateStats(token));
        setError("");
        showNotification("JWT decoded successfully!", "success");
      } catch (err) {
        setError(err.message);
        setDecodedHeader("");
        setDecodedPayload("");
        setSignature("");
        setTokenInfo(null);
        setStats({
          headerSize: 0,
          payloadSize: 0,
          signatureSize: 0,
          totalSize: 0,
        });
        showNotification(err.message, "error");
      }
    };

    if (token.trim()) {
      try {
        validateJWT(token);
        setError("");
        handleDecode();
      } catch (err) {
        setError(err.message);
        setDecodedHeader("");
        setDecodedPayload("");
        setSignature("");
        setTokenInfo(null);
        setStats({
          headerSize: 0,
          payloadSize: 0,
          signatureSize: 0,
          totalSize: 0,
        });
      }
    } else {
      setError("");
      setDecodedHeader("");
      setDecodedPayload("");
      setSignature("");
      setTokenInfo(null);
      setStats({
        headerSize: 0,
        payloadSize: 0,
        signatureSize: 0,
        totalSize: 0,
      });
    }
  }, [token, showNotification]);

  const isValid = !error && token.trim();
  const expired = tokenInfo?.exp ? isTokenExpired(tokenInfo.exp) : false;

  return (
    <div className={`jwt-tool-container ${isDarkMode ? "dark" : "light"}`}>
      <style>{`
        .jwt-tool-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          padding: 2rem;
          transition: all 0.3s ease;
        }
        
        .jwt-tool-container.dark {
          background-color: #0f172a;
          color: #e2e8f0;
        }
        
        .jwt-tool-container.light {
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
          background: linear-gradient(90deg, #f59e0b, #ef4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }
        
        .subtitle {
          color: #6b7280;
          margin: 0.5rem 0 0 0;
          font-size: 1.1rem;
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
        
        .jwt-tool-container.dark .stats {
          background-color: #1e293b;
          border: 1px solid #334155;
        }
        
        .jwt-tool-container.light .stats {
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
        .stat-value.orange { color: #f59e0b; }
        .stat-value.red { color: #dc2626; }
        .stat-value.purple { color: #8b5cf6; }
        
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
          background-color: #f59e0b;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background-color: #d97706;
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
        
        .btn-toggle {
          border: 2px solid #6b7280;
          background-color: transparent;
        }
        
        .jwt-tool-container.dark .btn-toggle {
          color: #e2e8f0;
        }
        
        .jwt-tool-container.light .btn-toggle {
          color: #1e293b;
        }
        
        .btn-toggle:hover:not(:disabled) {
          border-color: #f59e0b;
        }
        
        .btn-toggle.active {
          background-color: #f59e0b;
          border-color: #f59e0b;
          color: white;
        }

        /* Input Section */
        .input-section {
          margin-bottom: 2rem;
        }

        .input-panel {
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .jwt-tool-container.dark .input-panel {
          background-color: #1e293b;
          border: 1px solid #334155;
        }
        
        .jwt-tool-container.light .input-panel {
          background-color: white;
          border: 1px solid #e2e8f0;
        }

        .input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid;
          font-weight: 600;
        }
        
        .jwt-tool-container.dark .input-header {
          border-color: #334155;
          background-color: #0f172a;
        }
        
        .jwt-tool-container.light .input-header {
          border-color: #e2e8f0;
          background-color: #f8fafc;
        }

        .input-title {
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
        
        .status-badge.expired {
          background-color: #f59e0b;
        }

        .textarea {
          width: 100%;
          min-height: 150px;
          padding: 1rem;
          font-family: 'Monaco', 'Consolas', 'Liberation Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          border: none;
          outline: none;
          resize: vertical;
          word-break: break-all;
        }
        
        .jwt-tool-container.dark .textarea {
          background-color: #0f172a;
          color: #e2e8f0;
        }
        
        .jwt-tool-container.light .textarea {
          background-color: #f8fafc;
          color: #1e293b;
        }

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

        /* Token Info */
        .token-info {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .jwt-tool-container.dark .token-info {
          background-color: #1e293b;
          border: 1px solid #334155;
        }
        
        .jwt-tool-container.light .token-info {
          background-color: white;
          border: 1px solid #e2e8f0;
        }

        .info-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #f59e0b;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        
        .jwt-tool-container.dark .info-item {
          background-color: #0f172a;
          border: 1px solid #334155;
        }
        
        .jwt-tool-container.light .info-item {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .info-label {
          color: #6b7280;
          font-weight: 500;
        }

        .info-value {
          font-weight: 600;
          color: #3b82f6;
        }

        .info-value.expired {
          color: #dc2626;
        }

        .info-value.valid {
          color: #16a34a;
        }

        .info-value.warning {
          color: #f59e0b;
        }

        /* Output Sections */
        .output-grid {
          display: grid;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .output-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .output-panel {
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .jwt-tool-container.dark .output-panel {
          background-color: #1e293b;
          border: 1px solid #334155;
        }
        
        .jwt-tool-container.light .output-panel {
          background-color: white;
          border: 1px solid #e2e8f0;
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid;
          font-weight: 600;
        }
        
        .jwt-tool-container.dark .output-header {
          border-color: #334155;
          background-color: #0f172a;
        }
        
        .jwt-tool-container.light .output-header {
          border-color: #e2e8f0;
          background-color: #f8fafc;
        }

        .output-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .output-title.header {
          color: #8b5cf6;
        }

        .output-title.payload {
          color: #3b82f6;
        }

        .output-title.signature {
          color: #f59e0b;
        }

        .output-content {
          padding: 1rem;
          min-height: 200px;
          font-family: 'Monaco', 'Consolas', 'Liberation Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          overflow: auto;
        }
        
        .jwt-tool-container.dark .output-content {
          background-color: #0f172a;
          color: #e2e8f0;
        }
        
        .jwt-tool-container.light .output-content {
          background-color: #f8fafc;
          color: #1e293b;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #6b7280;
          text-align: center;
        }

        .empty-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .signature-panel {
          grid-column: span 2;
        }

        @media (max-width: 1023px) {
          .signature-panel {
            grid-column: span 1;
          }
        }

        .signature-content {
          word-break: break-all;
          padding: 1rem;
          background-color: rgba(245, 158, 11, 0.1);
          border-radius: 0.5rem;
          margin: 1rem;
          font-family: monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .jwt-tool-container.dark .signature-content {
          background-color: rgba(245, 158, 11, 0.1);
          color: #fbbf24;
        }

        .jwt-tool-container.light .signature-content {
          background-color: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .jwt-tool-container {
            padding: 1rem;
          }
          
          .controls {
            justify-content: center;
          }
          
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .output-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
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
            <h1 className="title">JWT Tool</h1>
            <p className="subtitle">
              Decode and analyze JSON Web Tokens with comprehensive details
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-item">
            <div className="stat-value blue">{stats.totalSize}</div>
            <div className="stat-label">Total Size</div>
          </div>
          <div className="stat-item">
            <div className="stat-value purple">{stats.headerSize}</div>
            <div className="stat-label">Header</div>
          </div>
          <div className="stat-item">
            <div className="stat-value green">{stats.payloadSize}</div>
            <div className="stat-label">Payload</div>
          </div>
          <div className="stat-item">
            <div className="stat-value orange">{stats.signatureSize}</div>
            <div className="stat-label">Signature</div>
          </div>
          <div className="stat-item">
            <div
              className={`stat-value ${
                isValid ? (expired ? "orange" : "green") : "red"
              }`}
            >
              {!token.trim()
                ? "Empty"
                : isValid
                ? expired
                  ? "Expired"
                  : "Valid"
                : "Invalid"}
            </div>
            <div className="stat-label">Status</div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <button onClick={clearAll} className="btn btn-danger">
            <Trash2 style={{ width: "1rem", height: "1rem" }} />
            Clear
          </button>

          <button
            onClick={downloadJWT}
            disabled={!decodedHeader || !decodedPayload}
            className="btn btn-secondary"
          >
            <Download style={{ width: "1rem", height: "1rem" }} />
            Download
          </button>

          <button
            onClick={() => setShowSignature(!showSignature)}
            className={`btn btn-toggle ${showSignature ? "active" : ""}`}
          >
            {showSignature ? (
              <EyeOff style={{ width: "1rem", height: "1rem" }} />
            ) : (
              <Eye style={{ width: "1rem", height: "1rem" }} />
            )}
            {showSignature ? "Hide" : "Show"} Signature
          </button>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-panel">
            <div className="input-header">
              <div className="input-title">
                <Key style={{ width: "1.25rem", height: "1.25rem" }} />
                <h3>JWT Token</h3>
                {token && (
                  <span
                    className={`status-badge ${
                      isValid ? (expired ? "expired" : "valid") : "invalid"
                    }`}
                  >
                    {isValid ? (
                      expired ? (
                        <Clock
                          style={{ width: "0.75rem", height: "0.75rem" }}
                        />
                      ) : (
                        <CheckCircle
                          style={{ width: "0.75rem", height: "0.75rem" }}
                        />
                      )
                    ) : (
                      <AlertCircle
                        style={{ width: "0.75rem", height: "0.75rem" }}
                      />
                    )}
                    {isValid ? (expired ? "Expired" : "Valid") : "Invalid"}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => copyToClipboard(token, "Token")}
                  disabled={!token}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem", fontSize: "0.75rem" }}
                >
                  <Copy style={{ width: "0.875rem", height: "0.875rem" }} />
                </button>
              </div>
            </div>

            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your JWT token here..."
              className="textarea"
            />

            {error && (
              <div className="error-message">
                <AlertCircle
                  style={{
                    width: "1rem",
                    height: "1rem",
                    marginTop: "0.125rem",
                    flexShrink: 0,
                  }}
                />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Token Information */}
        {tokenInfo && (
          <div className="token-info">
            <h3 className="info-title">
              <User style={{ width: "1.25rem", height: "1.25rem" }} />
              Token Information
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Algorithm:</span>
                <span className="info-value">{tokenInfo.algorithm}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">{tokenInfo.type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Issued At:</span>
                <span className="info-value">
                  {formatTimestamp(tokenInfo.iat)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Expires At:</span>
                <span className={`info-value ${expired ? "expired" : "valid"}`}>
                  {formatTimestamp(tokenInfo.exp)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Time Until Expiry:</span>
                <span
                  className={`info-value ${
                    expired
                      ? "expired"
                      : getTimeUntilExpiry(tokenInfo.exp).includes("d")
                      ? "valid"
                      : "warning"
                  }`}
                >
                  {getTimeUntilExpiry(tokenInfo.exp)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Not Before:</span>
                <span className="info-value">
                  {formatTimestamp(tokenInfo.nbf)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Subject:</span>
                <span className="info-value">
                  {tokenInfo.sub || "Not provided"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Audience:</span>
                <span className="info-value">
                  {tokenInfo.aud || "Not provided"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Issuer:</span>
                <span className="info-value">
                  {tokenInfo.iss || "Not provided"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">JWT ID:</span>
                <span className="info-value">
                  {tokenInfo.jti || "Not provided"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Output Sections */}
        <div className="output-grid">
          {/* Header Section */}
          <div className="output-panel">
            <div className="output-header">
              <div className="output-title header">
                <Shield style={{ width: "1.25rem", height: "1.25rem" }} />
                <h3>Header</h3>
              </div>
              <button
                onClick={() => copyToClipboard(decodedHeader, "Header")}
                disabled={!decodedHeader}
                className="btn btn-secondary"
                style={{ padding: "0.5rem", fontSize: "0.75rem" }}
              >
                <Copy style={{ width: "0.875rem", height: "0.875rem" }} />
              </button>
            </div>
            <div className="output-content">
              {decodedHeader ? (
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {decodedHeader}
                </pre>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🛡️</div>
                  <div>JWT header will appear here</div>
                </div>
              )}
            </div>
          </div>

          {/* Payload Section */}
          <div className="output-panel">
            <div className="output-header">
              <div className="output-title payload">
                <User style={{ width: "1.25rem", height: "1.25rem" }} />
                <h3>Payload</h3>
              </div>
              <button
                onClick={() => copyToClipboard(decodedPayload, "Payload")}
                disabled={!decodedPayload}
                className="btn btn-secondary"
                style={{ padding: "0.5rem", fontSize: "0.75rem" }}
              >
                <Copy style={{ width: "0.875rem", height: "0.875rem" }} />
              </button>
            </div>
            <div className="output-content">
              {decodedPayload ? (
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {decodedPayload}
                </pre>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">👤</div>
                  <div>JWT payload will appear here</div>
                </div>
              )}
            </div>
          </div>

          {/* Signature Section */}
          {showSignature && (
            <div className="output-panel signature-panel">
              <div className="output-header">
                <div className="output-title signature">
                  <Key style={{ width: "1.25rem", height: "1.25rem" }} />
                  <h3>Signature</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(signature, "Signature")}
                  disabled={!signature}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem", fontSize: "0.75rem" }}
                >
                  <Copy style={{ width: "0.875rem", height: "0.875rem" }} />
                </button>
              </div>
              <div className="output-content">
                {signature ? (
                  <div className="signature-content">{signature}</div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🔑</div>
                    <div>JWT signature will appear here</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div
          style={{
            marginTop: "2rem",
            padding: "2rem",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          className={isDarkMode ? "dark-panel" : "light-panel"}
        >
          <style>{`
            .dark-panel {
              background-color: #1e293b;
              border: 1px solid #334155;
            }
            .light-panel {
              background-color: white;
              border: 1px solid #e2e8f0;
            }
          `}</style>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
              color: "#f59e0b",
            }}
          >
            About JSON Web Tokens (JWT)
          </h3>
          <div style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <div
              style={{
                marginBottom: "0.5rem",
                color: "#6b7280",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  color: "#f59e0b",
                  fontWeight: "bold",
                  marginTop: "0.125rem",
                }}
              >
                •
              </span>
              JWTs are compact, URL-safe tokens used for securely transmitting
              information between parties
            </div>
            <div
              style={{
                marginBottom: "0.5rem",
                color: "#6b7280",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  color: "#f59e0b",
                  fontWeight: "bold",
                  marginTop: "0.125rem",
                }}
              >
                •
              </span>
              Consists of three parts: Header, Payload, and Signature, separated
              by dots (.)
            </div>
            <div
              style={{
                marginBottom: "0.5rem",
                color: "#6b7280",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  color: "#f59e0b",
                  fontWeight: "bold",
                  marginTop: "0.125rem",
                }}
              >
                •
              </span>
              Header contains metadata about the token type and signing
              algorithm
            </div>
            <div
              style={{
                marginBottom: "0.5rem",
                color: "#6b7280",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  color: "#f59e0b",
                  fontWeight: "bold",
                  marginTop: "0.125rem",
                }}
              >
                •
              </span>
              Payload contains claims (statements about an entity and additional
              data)
            </div>
            <div
              style={{
                marginBottom: "0.5rem",
                color: "#6b7280",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  color: "#f59e0b",
                  fontWeight: "bold",
                  marginTop: "0.125rem",
                }}
              >
                •
              </span>
              Signature ensures the token hasn't been altered and verifies
              authenticity
            </div>
            <div
              style={{
                color: "#6b7280",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  color: "#f59e0b",
                  fontWeight: "bold",
                  marginTop: "0.125rem",
                }}
              >
                •
              </span>
              Commonly used for authentication, authorization, and secure
              information exchange
            </div>
          </div>
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
            Decode, analyze, and validate JSON Web Tokens with comprehensive
            token information
          </p>
        </div>
      </div>
    </div>
  );
};

export default JWTTool;
