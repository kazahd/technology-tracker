import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotification = () => {
  const { addNotification, removeNotification } = useContext(NotificationContext);

  const showSuccess = (message, action = null) => {
    return addNotification(message, 'success', action);
  };

  const showError = (message, action = null) => {
    return addNotification(message, 'error', action);
  };

  const showWarning = (message, action = null) => {
    return addNotification(message, 'warning', action);
  };

  const showInfo = (message, action = null) => {
    return addNotification(message, 'info', action);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification
  };
};