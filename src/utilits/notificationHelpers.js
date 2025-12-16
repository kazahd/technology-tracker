import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotification = () => {
  const { addNotification } = useContext(NotificationContext);

  const showSuccess = (message, action = null, persist = false) => {
    return addNotification(message, 'success', action, persist);
  };

  const showError = (message, action = null, persist = false) => {
    const errorAction = action || {
      label: 'Повторить',
      onClick: () => window.location.reload(),
      closeOnClick: false
    };
    return addNotification(message, 'error', errorAction, persist);
  };

  const showWarning = (message, action = null, persist = false) => {
    return addNotification(message, 'warning', action, persist);
  };

  const showInfo = (message, action = null, persist = false) => {
    return addNotification(message, 'info', action, persist);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};