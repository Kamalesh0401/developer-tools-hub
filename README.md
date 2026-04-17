# Developer Tools Hub 🛠️ 

Hosted Link: [https://kamalesh0401.github.io/developer-tools-hub/](https://developer-tools-hub.netlify.app/json-viewer)

A comprehensive collection of essential developer tools built with React. This application provides JSON formatting, JWT decoding, and Base64 encoding/decoding capabilities with a modern, user-friendly interface.

![Developer Tools Hub](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

## ✨ Features

### 🔧 Core Tools
- **JSON Viewer/Formatter**: Format, validate, and visualize JSON data
- **JWT Decoder**: Decode and analyze JSON Web Tokens
- **Base64 Encoder/Decoder**: Convert text to/from Base64 encoding

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes for comfortable usage
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Validation**: Instant feedback for invalid data
- **Copy to Clipboard**: One-click copying for all outputs
- **File Upload Support**: Upload files for processing
- **Tree View**: Interactive JSON tree visualization

### ⚡ Technical Features
- **Modern React**: Built with React 18+ and hooks
- **Performance Optimized**: Fast rendering and smooth interactions
- **Accessible**: WCAG compliant with proper ARIA labels
- **Error Handling**: Comprehensive error messages and recovery
- **Offline Support**: Service worker for offline functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/developer-tools-hub.git
   cd developer-tools-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
developer-tools-hub/
├── public/
│   ├── index.html              # HTML template
│   ├── favicon.ico             # App icon
│   └── manifest.json           # PWA manifest
├── src/
│   ├── components/
│   │   ├── common/             # Shared components
│   │   │   ├── Header.js       # Navigation header
│   │   │   ├── Footer.js       # Page footer
│   │   │   ├── Notification.js # Toast notifications
│   │   │   └── TechStackPanel.js # Side panel
│   │   ├── tools/              # Tool components
│   │   │   ├── JSONTool.js     # JSON formatter
│   │   │   ├── JWTTool.js      # JWT decoder
│   │   │   └── Base64Tool.js   # Base64 encoder/decoder
│   │   └── layout/
│   │       └── Layout.js       # Main layout wrapper
│   ├── hooks/
│   │   └── useNotification.js  # Custom notification hook
│   ├── utils/
│   │   ├── jsonUtils.js        # JSON processing utilities
│   │   ├── jwtUtils.js         # JWT processing utilities
│   │   └── base64Utils.js      # Base64 processing utilities
│   ├── styles/
│   │   └── globals.css         # Global styles
│   ├── App.js                  # Main app component
│   ├── App.css                 # App-specific styles
│   └── index.js                # React entry point
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                   # This file
```

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (⚠️ irreversible)

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Modern React with hooks
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **PostCSS** - CSS processing tool

### Development
- **Create React App** - React application boilerplate
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting

### Deployment
- **Netlify** or **Vercel** - Static site hosting
- **GitHub Actions** - CI/CD pipeline

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Usage Guide

### JSON Formatter
1. Paste or type JSON data in the input area
2. Click "Format / Beautify" to format the JSON
3. Click "Minify" to compress the JSON
4. Toggle "Tree View" for interactive JSON exploration
5. Use "Copy" to copy the formatted result

### JWT Decoder
1. Paste a JWT token in the input field
2. The tool automatically decodes header, payload, and signature
3. View token information including expiration and claims
4. Copy individual sections as needed

### Base64 Encoder/Decoder
1. Enter text or upload a file
2. Click "Encode" to convert to Base64
3. Click "Decode" to convert from Base64
4. Download results or copy to clipboard

## 🎨 Customization

### Themes
The application supports both dark and light themes. Users can toggle between themes using the moon/sun icon in the header.

### Adding New Tools
To add a new tool:

1. Create a new component in `src/components/tools/`
2. Add utility functions in `src/utils/`
3. Update the main App.js to include the new tool
4. Add navigation in Header.js

## 📱 Progressive Web App

This application is built as a PWA with:
- Offline functionality
- App-like experience on mobile
- Fast loading with service worker caching
- Installable on mobile devices

## 🔒 Privacy & Security

- **No Data Collection**: All processing happens client-side
- **No Server Required**: Completely static application
- **Privacy First**: No analytics or tracking by default
- **Secure**: No data is sent to external servers

## 🚀 Deployment

### Netlify
1. Fork this repository
2. Connect your GitHub account to Netlify
3. Select the repository and deploy
4. Build command: `npm run build`
5. Publish directory: `build`

### Vercel
1. Fork this repository
2. Import project to Vercel
3. Deploy with default settings

### Manual Deployment
```bash
npm run build
# Upload the 'build' folder to your hosting provider
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide React for beautiful icons
- Create React App for the development setup

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the existing issues for solutions
- Contribute to make the project better

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- Initial release
- JSON formatter with tree view
- JWT decoder with token analysis
- Base64 encoder/decoder
- Dark/light theme support
- Responsive design
- PWA functionality

---

**Built with ❤️ by developers, for developers**
