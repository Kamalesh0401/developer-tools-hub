// src/hooks/useNotification.js
import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  // Show new notification
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now(); // unique id for each notification
    const newNotification = { id, message, type };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  // Remove notification by id
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification,
  };
};
