
import React from 'react';
import { Github, Mail, Info } from 'lucide-react';
import './Footer.css';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`footer ${isDarkMode ? 'footer-dark' : 'footer-light'}`}>
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left">
            <div className="footer-text">
              © 2024 Developer Tools Hub. Built with React & CSS.
            </div>
          </div>

          <div className="footer-links">
            <a href="#" className="footer-link">
              <Info className="footer-icon" />
              <span>About</span>
            </a>
            <a href="#" className="footer-link">
              <Mail className="footer-icon" />
              <span>Contact</span>
            </a>
            <a href="#" className="footer-link">
              <Github className="footer-icon" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-subtext">
            Developer Tools Hub - JSON Formatter, JWT Decoder, Base64 Encoder/Decoder
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
