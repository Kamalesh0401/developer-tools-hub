import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Code, Server, Globe } from 'lucide-react';
import './TechStackPanel.css';

const TechStackPanel = ({ isDarkMode }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`tech-panel ${isDarkMode ? 'dark' : 'light'} ${isExpanded ? 'expanded' : 'collapsed'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`tech-toggle ${isDarkMode ? 'dark' : 'light'}`}
            >
                {isExpanded ? (
                    <ChevronRight className="icon" />
                ) : (
                    <ChevronDown className="icon rotate" />
                )}
            </button>

            {/* Panel Content */}
            <div className="tech-content">
                <h3 className="tech-title">Tech Stack Breakdown</h3>

                <div className="section-container">
                    {/* Frontend Section */}
                    <div>
                        <div className="section-header">
                            <Code className="icon small text-blue" />
                            <h4 className="section-title text-blue">Frontend</h4>
                        </div>
                        <ul className="section-list">
                            <li>• React + Vite</li>
                            <li>• React Hooks (useState, useEffect)</li>
                            <li>• Lucide React Icons</li>
                            <li>• Tailwind CSS for styling</li>
                            <li>• Custom components & utilities</li>
                        </ul>
                    </div>

                    {/* Backend Section */}
                    <div>
                        <div className="section-header">
                            <Server className="icon small text-green" />
                            <h4 className="section-title text-green">Backend</h4>
                            <span className="optional">Optional</span>
                        </div>
                        <ul className="section-list">
                            <li>• Client-side only (MVP)</li>
                            <li>• No server required</li>
                            <li>• Future: Node.js/Express</li>
                            <li>• Future: API endpoints</li>
                        </ul>
                    </div>

                    {/* Hosting Section */}
                    <div>
                        <div className="section-header">
                            <Globe className="icon small text-purple" />
                            <h4 className="section-title text-purple">Hosting</h4>
                        </div>
                        <ul className="section-list">
                            <li>• Netlify or Vercel</li>
                            <li>• Static site deployment</li>
                            <li>• CI/CD integration</li>
                            <li>• Custom domain support</li>
                        </ul>
                    </div>

                    {/* Features Section */}
                    <div className={`features-box ${isDarkMode ? 'dark' : 'light'}`}>
                        <h4 className="features-title">Key Features</h4>
                        <ul className="features-list">
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
