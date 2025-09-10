// src/components/tools/Base64Tool.js
import React, { useState, useEffect } from 'react';
import { Copy, Upload, Download, FileText, Image } from 'lucide-react';
import { encodeBase64, decodeBase64, detectDataType } from '../../utils/base64Utils';

const Base64Tool = ({ isDarkMode, showNotification }) => {
  const [input, setInput] = useState('Hello, World!');
  const [output, setOutput] = useState('');
  const [inputType, setInputType] = useState('text');
  const [outputType, setOutputType] = useState('text');
  const [lastOperation, setLastOperation] = useState('');

  const handleEncode = () => {
    try {
      const encoded = encodeBase64(input);
      setOutput(encoded);
      setLastOperation('encode');
      setOutputType('base64');
      showNotification('Text encoded to Base64!', 'success');
    } catch (err) {
      showNotification('Failed to encode', 'error');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeBase64(input);
      setOutput(decoded);
      setLastOperation('decode');
      setOutputType('text');
      showNotification('Base64 decoded successfully!', 'success');
    } catch (err) {
      showNotification('Invalid Base64 format', 'error');
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      if (file.type.startsWith('image/')) {
        // For images, we want the base64 data URL
        setInput(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        setInputType('image');
      } else {
        // For text files
        setInput(result);
        setInputType('text');
      }
      showNotification(`File "${file.name}" loaded successfully!`, 'success');
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const downloadOutput = () => {
    try {
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lastOperation === 'encode' ? 'encoded' : 'decoded'}_output.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('File downloaded successfully!', 'success');
    } catch (err) {
      showNotification('Failed to download file', 'error');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setInputType('text');
    setOutputType('text');
    setLastOperation('');
    showNotification('All fields cleared!', 'info');
  };

  const swapInputOutput = () => {
    const tempInput = input;
    const tempType = inputType;
    setInput(output);
    setOutput(tempInput);
    setInputType(outputType);
    setOutputType(tempType);
    setLastOperation(lastOperation === 'encode' ? 'decode' : 'encode');
    showNotification('Input and output swapped!', 'info');
  };

  useEffect(() => {
    if (input) {
      const type = detectDataType(input);
      setInputType(type);
    }
  }, [input]);

  const isValidBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const getInputIcon = () => {
    switch (inputType) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'base64':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Base64 Encoder/Decoder
          </h2>
          <p className="text-gray-500 mt-1">Encode text to Base64 or decode Base64 to text</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={swapInputOutput}
            disabled={!input || !output}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            ⇄ Swap
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {getInputIcon()}
              <span className="text-lg font-semibold">Input</span>
              <span className={`px-2 py-1 rounded text-xs ${
                inputType === 'base64' 
                  ? 'bg-blue-500 text-white' 
                  : inputType === 'image'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}>
                {inputType.toUpperCase()}
              </span>
            </div>
            <div className="flex space-x-2">
              <label className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="text/*,image/*"
                />
              </label>
              <button
                onClick={handleEncode}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Encode
              </button>
              <button
                onClick={handleDecode}
                disabled={!isValidBase64(input)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Decode
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
              placeholder="Enter text or paste Base64 here..."
            />
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <div className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                {input.length} chars
              </div>
              {input && isValidBase64(input) && (
                <div className="text-xs text-green-400 bg-green-900 px-2 py-1 rounded">
                  Valid Base64
                </div>
              )}
            </div>
          </div>

          {/* Input Analysis */}
          {input && (
            <div className={`p-3 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
            }`}>
              <h4 className="font-medium mb-2">Input Analysis</h4>
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2">{inputType}</span>
                </div>
                <div>
                  <span className="text-gray-500">Length:</span>
                  <span className="ml-2">{input.length} characters</span>
                </div>
                <div>
                  <span className="text-gray-500">Valid Base64:</span>
                  <span className={`ml-2 ${isValidBase64(input) ? 'text-green-400' : 'text-red-400'}`}>
                    {isValidBase64(input) ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span className="text-lg font-semibold">Output</span>
              {output && (
                <span className={`px-2 py-1 rounded text-xs ${
                  outputType === 'base64' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {outputType.toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={downloadOutput}
                disabled={!output}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
          </div>
          
          <div className={`w-full h-96 p-4 rounded-lg border overflow-auto ${
            isDarkMode
              ? 'bg-gray-800 border-gray-600'
              : 'bg-gray-50 border-gray-300'
          }`}>
            {output ? (
              <div>
                <pre className="font-mono text-sm whitespace-pre-wrap break-all">{output}</pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">🔄</div>
                  <div>
                    {lastOperation === 'encode' ? 'Encoded' : 'Decoded'} output will appear here
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Output Analysis */}
          {output && (
            <div className={`p-3 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
            }`}>
              <h4 className="font-medium mb-2">Output Analysis</h4>
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-gray-500">Operation:</span>
                  <span className="ml-2 capitalize">{lastOperation}</span>
                </div>
                <div>
                  <span className="text-gray-500">Length:</span>
                  <span className="ml-2">{output.length} characters</span>
                </div>
                <div>
                  <span className="text-gray-500">Size Difference:</span>
                  <span className={`ml-2 ${output.length > input.length ? 'text-red-400' : 'text-green-400'}`}>
                    {output.length > input.length ? '+' : ''}{output.length - input.length} chars
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Base64 Information */}
      <div className={`p-4 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
      }`}>
        <h3 className="font-semibold mb-2">About Base64</h3>
        <div className="text-sm text-gray-500 space-y-1">
          <p>• Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format</p>
          <p>• Each Base64 digit represents exactly 6 bits of data, using A-Z, a-z, 0-9, +, and / characters</p>
          <p>• Base64 encoding increases the size of data by approximately 33%</p>
          <p>• It's commonly used in email attachments, data URLs, and web APIs</p>
        </div>
      </div>
    </div>
  );
};

export default Base64Tool;