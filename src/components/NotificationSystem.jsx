import React, { useContext } from 'react';
import {
  Snackbar,
  Alert,
  IconButton,
  Box,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';

const NotificationSystem = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    notifications,
    removeNotification,
    clearAll,
    settings
  } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleIcon fontSize="inherit" />;
      case 'error': return <ErrorIcon fontSize="inherit" />;
      case 'warning': return <WarningIcon fontSize="inherit" />;
      case 'info': return <InfoIcon fontSize="inherit" />;
      default: return <InfoIcon fontSize="inherit" />;
    }
  };

  const handleClose = (id, reason) => {
    if (reason === 'clickaway') return;
    removeNotification(id);
  };

  const handleCloseAll = () => {
    clearAll();
  };

  if (!settings.enabled || notifications.length === 0) {
    return null;
  }

  return (
    <Box sx={{
      position: 'fixed',
      bottom: isMobile ? 8 : 16,
      right: isMobile ? 8 : 16,
      left: isMobile ? 8 : 'auto',
      zIndex: theme.zIndex.snackbar,
      width: isMobile ? 'calc(100% - 16px)' : 'auto',
      maxWidth: isMobile ? '100%' : 450
    }}>
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          autoHideDuration={settings.autoClose ? settings.duration : null}
          onClose={(event, reason) => handleClose(notification.id, reason)}
          anchorOrigin={{
            vertical: isMobile ? 'bottom' : 'bottom',
            horizontal: isMobile ? 'center' : 'right'
          }}
          sx={{ 
            mb: 1,
            // На мобильных показываем только последнее уведомление
            display: isMobile && index > 0 ? 'none' : 'block'
          }}
          ClickAwayListenerProps={{
            mouseEvent: false,
            touchEvent: false
          }}
        >
          <Alert
            severity={notification.type}
            variant="filled"
            icon={getIcon(notification.type)}
            onClose={() => handleClose(notification.id)}
            sx={{
              width: '100%',
              alignItems: 'center',
              '& .MuiAlert-message': {
                flex: 1
              }
            }}
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {notification.action && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      notification.action.onClick();
                      removeNotification(notification.id);
                    }}
                    sx={{ 
                      minWidth: 'auto',
                      fontSize: '0.75rem',
                      textTransform: 'none'
                    }}
                  >
                    {notification.action.label}
                  </Button>
                )}
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => handleClose(notification.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
      
      {notifications.length > 1 && !isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <IconButton
            size="small"
            onClick={handleCloseAll}
            sx={{ 
              color: 'text.secondary',
              bgcolor: 'background.paper',
              boxShadow: 1
            }}
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