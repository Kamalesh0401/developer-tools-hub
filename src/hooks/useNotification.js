// src/hooks/useNotification.js
import { useState, useCallback } from "react";

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const showNotification = useCallback(
    (message, type = "info") => {
      const id = Date.now() + Math.random();
      const notification = { id, message, type };

      setNotifications((prev) => [...prev, notification]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeNotification(id);
      }, 5000);

      return id;
    },
    [removeNotification]
  );

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
  };
};
