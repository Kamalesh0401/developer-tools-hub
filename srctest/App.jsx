

// // // src/App.js
// // import React, { useState } from 'react';
// // import Layout from './components/layout/Layout';
// // import JSONTool from './components/tools/JSONTool';
// // import JWTTool from './components/tools/JWTTool';
// // import Base64Tool from './components/tools/Base64Tool';
// // import { useNotification } from './hooks/useNotification';
// // import './App.css';

// // const App = () => {
// //   const [activeTab, setActiveTab] = useState('JSON');
// //   const [isDarkMode, setIsDarkMode] = useState(true);
// //   const { notifications, showNotification, removeNotification } = useNotification();

// //   const renderActiveComponent = () => {
// //     switch (activeTab) {
// //       case 'JSON':
// //         return <JSONTool isDarkMode={isDarkMode} showNotification={showNotification} />;
// //       case 'JWT':
// //         return <JWTTool isDarkMode={isDarkMode} showNotification={showNotification} />;
// //       case 'Base64':
// //         return <Base64Tool isDarkMode={isDarkMode} showNotification={showNotification} />;
// //       default:
// //         return <JSONTool isDarkMode={isDarkMode} showNotification={showNotification} />;
// //     }
// //   };

// //   return (
// //     <Layout
// //       activeTab={activeTab}
// //       setActiveTab={setActiveTab}
// //       isDarkMode={isDarkMode}
// //       setIsDarkMode={setIsDarkMode}
// //       notifications={notifications}
// //       removeNotification={removeNotification}
// //     >
// //       {renderActiveComponent()}
// //     </Layout>
// //   );
// // };

// // export default App;



// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { store } from './redux/store';
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';
// import JSONViewer from './components/JSONViewer/JSONViewer';
// import JWTDecoder from './components/JWTDecoder/JWTDecoder';
// import Base64Tool from './components/Base64Tool/Base64Tool';
// import './styles/globals.css';

// function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <div className="app">
//           <Navbar />
//           <main className="main-content">
//             <Routes>
//               <Route path="/" element={<JSONViewer />} />
//               <Route path="/json" element={<JSONViewer />} />
//               <Route path="/jwt" element={<JWTDecoder />} />
//               <Route path="/base64" element={<Base64Tool />} />
//             </Routes>
//           </main>
//           <Footer />
//         </div>
//       </Router>
//     </Provider>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import JSONViewer from './components/JSONViewer/JSONViewer';
import JWTDecoder from './components/JWTDecoder/JWTDecoder';
import Base64Tool from './components/Base64Tool/Base64Tool';
import './styles/globals.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<JSONViewer />} />
              <Route path="/json" element={<JSONViewer />} />
              <Route path="/jwt" element={<JWTDecoder />} />
              <Route path="/base64" element={<Base64Tool />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}
export default App;
