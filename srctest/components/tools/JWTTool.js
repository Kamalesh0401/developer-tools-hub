// src/components/tools/JWTTool.js
import React, { useState, useEffect } from 'react';
import { Copy, AlertCircle, Key, User, Shield } from 'lucide-react';
import { decodeJWT, validateJWT } from '../../utils/jwtUtils';

const JWTTool = ({ isDarkMode, showNotification }) => {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [decodedHeader, setDecodedHeader] = useState('');
  const [decodedPayload, setDecodedPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);

  const handleDecode = () => {
    try {
      const result = decodeJWT(token);
      setDecodedHeader(JSON.stringify(result.header, null, 2));
      setDecodedPayload(JSON.stringify(result.payload, null, 2));
      setSignature(result.signature);
      setTokenInfo(result.info);
      setError('');
      showNotification('JWT decoded successfully!', 'success');
    } catch (err) {
      setError(err.message);
      setDecodedHeader('');
      setDecodedPayload('');
      setSignature('');
      setTokenInfo(null);
      showNotification('Invalid JWT token', 'error');
    }
  };

  const copyToClipboard = async (content, section) => {
    try {
      await navigator.clipboard.writeText(content);
      showNotification(`${section} copied to clipboard!`, 'success');
    } catch (err) {
      showNotification('Failed to copy', 'error');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Not provided';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const isTokenExpired = (exp) => {
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  };

  useEffect(() => {
    if (token) {
      handleDecode();
    }
  }, []);

  useEffect(() => {
    if (token) {
      try {
        validateJWT(token);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            JWT Decoder
          </h2>
          <p className="text-gray-500 mt-1">Decode and analyze JSON Web Tokens</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>JWT Token</span>
            {!error && token && (
              <span className="text-green-400 text-sm">✓ Valid JWT</span>
            )}
          </span>
          <button
            onClick={handleDecode}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Decode
          </button>
        </div>
        
        <div className="relative">
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={`w-full h-32 p-4 rounded-lg border font-mono text-sm resize-none ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
            placeholder="Paste your JWT token here..."
          />
          {token && (
            <div className="absolute top-2 right-2">
              <div className={`px-2 py-1 rounded text-xs ${
                error ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {error ? 'Invalid' : 'Valid JWT'}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="flex items-start space-x-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-red-400">JWT Error</div>
              <div className="text-sm text-red-300">{error}</div>
            </div>
          </div>
        )}

        {/* Token Info */}
        {tokenInfo && (
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
          }`}>
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Token Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Algorithm:</span>
                <span className="ml-2 font-mono">{tokenInfo.algorithm}</span>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 font-mono">{tokenInfo.type}</span>
              </div>
              <div>
                <span className="text-gray-500">Issued At:</span>
                <span className="ml-2">{formatTimestamp(tokenInfo.iat)}</span>
              </div>
              <div>
                <span className="text-gray-500">Expires At:</span>
                <span className={`ml-2 ${isTokenExpired(tokenInfo.exp) ? 'text-red-400' : 'text-green-400'}`}>
                  {formatTimestamp(tokenInfo.exp)}
                  {isTokenExpired(tokenInfo.exp) && ' (EXPIRED)'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Not Before:</span>
                <span className="ml-2">{formatTimestamp(tokenInfo.nbf)}</span>
              </div>
              <div>
                <span className="text-gray-500">Subject:</span>
                <span className="ml-2">{tokenInfo.sub || 'Not provided'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Output Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-400" />
              <span className="text-lg font-semibold text-red-400">Header</span>
            </div>
            <button
              onClick={() => copyToClipboard(decodedHeader, 'Header')}
              disabled={!decodedHeader}
              className="flex items-center space-x-2 px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded text-sm transition-all duration-200 transform hover:scale-105"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          
          <div className={`p-4 rounded-lg border h-72 overflow-auto ${
            isDarkMode
              ? 'bg-gray-800 border-red-500/30'
              : 'bg-red-50 border-red-200'
          }`}>
            {decodedHeader ? (
              <pre className="font-mono text-sm whitespace-pre-wrap">{decodedHeader}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-red-400" />
                  <div>JWT header will appear here</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payload */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-400" />
              <span className="text-lg font-semibold text-purple-400">Payload</span>
            </div>
            <button
              onClick={() => copyToClipboard(decodedPayload, 'Payload')}
              disabled={!decodedPayload}
              className="flex items-center space-x-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded text-sm transition-all duration-200 transform hover:scale-105"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          
          <div className={`p-4 rounded-lg border h-72 overflow-auto ${
            isDarkMode
              ? 'bg-gray-800 border-purple-500/30'
              : 'bg-purple-50 border-purple-200'
          }`}>
            {decodedPayload ? (
              <pre className="font-mono text-sm whitespace-pre-wrap">{decodedPayload}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <User className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div>JWT payload will appear here</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Signature */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-semibold text-blue-400">Signature</span>
            </div>
            <button
              onClick={() => copyToClipboard(signature, 'Signature')}
              disabled={!signature}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded text-sm transition-all duration-200 transform hover:scale-105"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          
          <div className={`p-4 rounded-lg border h-72 overflow-auto ${
            isDarkMode
              ? 'bg-gray-800 border-blue-500/30'
              : 'bg-blue-50 border-blue-200'
          }`}>
            {signature ? (
              <div className="font-mono text-sm break-all">{signature}</div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Key className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div>JWT signature will appear here</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JWT Structure Explanation */}
      <div className={`p-4 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
      }`}>
        <h3 className="font-semibold mb-2">JWT Structure</h3>
        <p className="text-sm text-gray-500 mb-3">
          A JWT consists of three parts separated by dots (.), each base64url encoded:
        </p>
        <div className="font-mono text-sm space-y-1">
          <div><span className="text-red-400">Header</span><span className="text-gray-400">.</span><span className="text-purple-400">Payload</span><span className="text-gray-400">.</span><span className="text-blue-400">Signature</span></div>
          <div className="text-xs text-gray-500 mt-2">
            • Header: Contains the signing algorithm and token type<br/>
            • Payload: Contains the claims (user data and metadata)<br/>
            • Signature: Used to verify the token hasn't been tampered with
          </div>
        </div>
      </div>
    </div>
  );
};

export default JWTTool;