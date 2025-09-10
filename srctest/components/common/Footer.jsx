// // src/components/common/Footer.js
// import React from 'react';
// import { Github, Mail, Info } from 'lucide-react';

// const Footer = ({ isDarkMode }) => {
//   return (
//     <footer className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-6 py-6 mt-12`}>
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//           <div className="flex items-center space-x-4">
//             <div className="text-sm text-gray-500">
//               © 2024 Developer Tools Hub. Built with React & Tailwind CSS.
//             </div>
//           </div>

//           <div className="flex items-center space-x-6">
//             <a 
//               href="#" 
//               className={`flex items-center space-x-2 text-sm transition-colors ${
//                 isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               <Info className="w-4 h-4" />
//               <span>About</span>
//             </a>
//             <a 
//               href="#" 
//               className={`flex items-center space-x-2 text-sm transition-colors ${
//                 isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               <Mail className="w-4 h-4" />
//               <span>Contact</span>
//             </a>
//             <a 
//               href="#" 
//               className={`flex items-center space-x-2 text-sm transition-colors ${
//                 isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               <Github className="w-4 h-4" />
//               <span>GitHub</span>
//             </a>
//           </div>
//         </div>

//         <div className="mt-4 pt-4 border-t border-gray-600">
//           <div className="text-xs text-gray-500 text-center">
//             Developer Tools Hub - JSON Formatter, JWT Decoder, Base64 Encoder/Decoder
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



import React from 'react';

const Footer = () => (
  <footer className="footer">
    <a href="#about">About</a> | <a href="#contact">Contact</a> | <a href="https://github.com/">GitHub</a>
  </footer>
);
export default Footer;
