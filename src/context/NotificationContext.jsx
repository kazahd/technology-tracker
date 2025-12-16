import React, { createContext, useContext, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [settings] = useLocalStorage('notification-settings', {
    enabled: true,
    autoClose: true,
    duration: 6000
  });

  const addNotification = useCallback((message, type = 'info', action = null) => {
    if (!settings.enabled) return;

    const newNotification = {
      id: Date.now(),
      message,
      type,
      action,
      open: true
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    return newNotification.id;
  }, [settings.enabled]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    settings
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Экспортируем контекст
export { NotificationContext };