// src/pages/Settings.jsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Save as SaveIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';
import { useSettings } from '../App';

function Settings() {
  const { settings, updateSettings } = useSettings();

  const handleChange = (setting) => (event) => {
    const newSettings = {
      ...settings,
      [setting]: event.target.checked
    };
    updateSettings(newSettings);
  };

  const handleLanguageChange = (lang) => {
    const newSettings = {
      ...settings,
      language: lang
    };
    updateSettings(newSettings);
  };

  const handleReset = () => {
    if (window.confirm('Сбросить все настройки к значениям по умолчанию?')) {
      const defaultSettings = {
        darkMode: false,
        notifications: true,
        autoSave: true,
        language: 'ru'
      };
      updateSettings(defaultSettings);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ⚙️ Настройки приложения
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Внешний вид
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              {settings.darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText 
              primary="Темная тема" 
              secondary="Включить темный режим интерфейса" 
            />
            <Switch
              checked={settings.darkMode}
              onChange={handleChange('darkMode')}
              color="primary"
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Уведомления
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Показывать уведомления" 
              secondary="Отображать системные уведомления" 
            />
            <Switch
              checked={settings.notifications}
              onChange={handleChange('notifications')}
              color="primary"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Автосохранение" 
              secondary="Автоматически сохранять изменения" 
            />
            <Switch
              checked={settings.autoSave}
              onChange={handleChange('autoSave')}
              color="primary"
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Язык интерфейса
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={settings.language === 'ru' ? 'contained' : 'outlined'}
            onClick={() => handleLanguageChange('ru')}
            startIcon={<LanguageIcon />}
          >
            Русский
          </Button>
          <Button
            variant={settings.language === 'en' ? 'contained' : 'outlined'}
            onClick={() => handleLanguageChange('en')}
            startIcon={<LanguageIcon />}
          >
            English
          </Button>
        </Box>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        Настройки автоматически сохраняются в вашем браузере и применяются сразу.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          startIcon={<RestoreIcon />}
          onClick={handleReset}
          variant="outlined"
          color="secondary"
        >
          Сбросить настройки
        </Button>
      </Box>
    </Box>
  );
}

export default Settings;