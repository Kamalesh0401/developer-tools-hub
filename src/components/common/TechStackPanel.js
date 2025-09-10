// src/components/common/TechStackPanel.js
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Code, Server, Globe } from 'lucide-react';

const TechStackPanel = ({ isDarkMode }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`fixed right-6 top-32 w-80 rounded-lg shadow-xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } ${isExpanded ? 'translate-x-0' : 'translate-x-72'}`}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`absolute -left-10 top-4 p-2 rounded-l-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                    } border-l border-t border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
                {isExpanded ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 rotate-90" />}
            </button>

            {/* Panel Content */}
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Tech Stack Breakdown
                </h3>

                <div className="space-y-4">
                    {/* Frontend Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Code className="w-4 h-4 text-blue-400" />
                            <h4 className="font-medium text-blue-400">Frontend</h4>
                        </div>
                        <ul className="space-y-1 text-sm text-gray-300 ml-6">
                            <li>• React + Vite</li>
                            <li>• React Hooks (useState, useEffect)</li>
                            <li>• Lucide React Icons</li>
                            <li>• Tailwind CSS for styling</li>
                            <li>• Custom components & utilities</li>
                        </ul>
                    </div>

                    {/* Backend Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Server className="w-4 h-4 text-green-400" />
                            <h4 className="font-medium text-green-400">Backend</h4>
                            <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-0.5 rounded">
                                Optional
                            </span>
                        </div>
                        <ul className="space-y-1 text-sm text-gray-300 ml-6">
                            <li>• Client-side only (MVP)</li>
                            <li>• No server required</li>
                            <li>• Future: Node.js/Express</li>
                            <li>• Future: API endpoints</li>
                        </ul>
                    </div>

                    {/* Hosting Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Globe className="w-4 h-4 text-purple-400" />
                            <h4 className="font-medium text-purple-400">Hosting</h4>
                        </div>
                        <ul className="space-y-1 text-sm text-gray-300 ml-6">
                            <li>• Netlify or Vercel</li>
                            <li>• Static site deployment</li>
                            <li>• CI/CD integration</li>
                            <li>• Custom domain support</li>
                        </ul>
                    </div>

                    {/* Features Section */}
                    <div className={`mt-6 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <h4 className="font-medium text-indigo-400 mb-2">Key Features</h4>
                        <ul className="space-y-1 text-xs text-gray-400">
                            <li>✓ JSON formatting & validation</li>
                            <li>✓ JWT token decoding</li>
                            <li>✓ Base64 encoding/decoding</li>
                            <li>✓ Dark/Light theme toggle</li>
                            <li>✓ Copy to clipboard</li>
                            <li>✓ File upload support</li>
                            <li>✓ Error handling</li>
                            <li>✓ Responsive design</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechStackPanel;