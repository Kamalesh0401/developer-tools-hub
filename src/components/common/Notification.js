// // src/components/common/Notification.js
// import React, { useEffect } from 'react';
// import { CheckCircle, XCircle, Info, X } from 'lucide-react';

// const Notification = ({ notification, onRemove }) => {
//   const { id, message, type } = notification;

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onRemove(id);
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [id, onRemove]);

//   const getIcon = () => {
//     switch (type) {
//       case 'success':
//         return <CheckCircle className="w-5 h-5" />;
//       case 'error':
//         return <XCircle className="w-5 h-5" />;
//       case 'info':
//         return <Info className="w-5 h-5" />;
//       default:
//         return <Info className="w-5 h-5" />;
//     }
//   };

//   const getStyles = () => {
//     switch (type) {
//       case 'success':
//         return 'bg-green-600 border-green-500';
//       case 'error':
//         return 'bg-red-600 border-red-500';
//       case 'info':
//         return 'bg-blue-600 border-blue-500';
//       default:
//         return 'bg-gray-600 border-gray-500';
//     }
//   };

//   return (
//     <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${getStyles()}`}>
//       {getIcon()}
//       <span className="flex-1 text-sm font-medium">{message}</span>
//       <button
//         onClick={() => onRemove(id)}
//         className="p-1 hover:bg-white/20 rounded transition-colors"
//       >
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// export default Notification;




// src/components/common/Notification.js
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import './Notification.css';

const Notification = ({ notification, onRemove }) => {
  const { id, message, type } = notification;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="icon" />;
      case 'error':
        return <XCircle className="icon" />;
      case 'info':
        return <Info className="icon" />;
      default:
        return <Info className="icon" />;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'notification-success';
      case 'error':
        return 'notification-error';
      case 'info':
        return 'notification-info';
      default:
        return 'notification-default';
    }
  };

  return (
    <div className={`notification ${getTypeClass()}`}>
      {getIcon()}
      <span className="notification-message">{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="notification-close"
      >
        <X className="close-icon" />
      </button>
    </div>
  );
};

export default Notification;

