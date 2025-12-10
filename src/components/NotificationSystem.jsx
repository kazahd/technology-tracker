// src/components/NotificationSystem.jsx
import React from 'react';
import {
  Snackbar,
  Alert,
  IconButton,
  Box
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const NotificationSystem = () => {
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      message: 'Технология "React Hooks" успешно добавлена',
      type: 'success',
      open: true
    },
    {
      id: 2,
      message: 'Не удалось обновить статус технологии',
      type: 'error',
      open: true
    },
    {
      id: 3,
      message: 'Рекомендуется добавить ресурсы для изучения',
      type: 'warning',
      open: true
    }
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleIcon fontSize="inherit" />;
      case 'error': return <ErrorIcon fontSize="inherit" />;
      case 'warning': return <WarningIcon fontSize="inherit" />;
      case 'info': return <InfoIcon fontSize="inherit" />;
      default: return <InfoIcon fontSize="inherit" />;
    }
  };

  const handleClose = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, open: false }
          : notification
      )
    );
    
    // Полное удаление через 500ms после закрытия
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 500);
  };

  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      open: true
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Максимум 5 уведомлений
  };

  const handleCloseAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, open: false })));
    setTimeout(() => {
      setNotifications([]);
    }, 500);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ mb: 1 }}
        >
          <Alert
            severity={notification.type}
            variant="filled"
            icon={getIcon(notification.type)}
            onClose={() => handleClose(notification.id)}
            sx={{ 
              width: '100%',
              minWidth: 300,
              maxWidth: 450,
              alignItems: 'center'
            }}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => handleClose(notification.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
      
      {notifications.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <IconButton
            size="small"
            onClick={handleCloseAll}
            sx={{ color: 'text.secondary' }}
            title="Закрыть все уведомления"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default NotificationSystem;