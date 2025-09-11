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

