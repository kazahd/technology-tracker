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
  Alert,
  Stack
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  Restore as RestoreIcon,
  Backup as BackupIcon,
  CloudUpload as CloudUploadIcon,
  DeleteForever as DeleteForeverIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';

function Settings({ 
  settings, 
  setSettings, 
  technologies, 
  updateTechnologies, 
  initialTechnologies,
  toggleTheme
}) {
  const { settings: notificationSettings } = useNotifications();

  // Обновленный обработчик для темы
  const handleThemeChange = (event) => {
    // Просто вызываем toggleTheme, который уже обновит settings в App.jsx
    toggleTheme();
  };

  // Отдельный обработчик для других настроек
  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const handleResetSettings = () => {
    if (window.confirm('Сбросить все настройки к значениям по умолчанию?')) {
      const defaultSettings = {
        darkMode: false,
        notifications: true,
        autoSave: true,
        language: 'ru'
      };
      setSettings(defaultSettings);
      
      // Если текущая тема темная, переключаем на светлую
      if (settings.darkMode) {
        toggleTheme();
      }
    }
  };

  const handleExportData = () => {
    const settingsData = JSON.parse(localStorage.getItem('app-settings') || '{}');
    
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      technologies,
      settings: settingsData
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `technology-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert(`✅ Данные успешно экспортированы! Файл: ${exportFileDefaultName}`);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          
          if (!importedData.technologies || !Array.isArray(importedData.technologies)) {
            throw new Error('Некорректный формат файла');
          }
          
          if (window.confirm(
            `Импортировать ${importedData.technologies.length} технологий и настройки? ` +
            'Существующие данные будут перезаписаны.'
          )) {
            updateTechnologies(importedData.technologies);
            
            if (importedData.settings) {
              setSettings(importedData.settings);
              // Не нужно вызывать toggleTheme, так как setSettings уже обновит тему
            }
            
            alert('✅ Данные успешно импортированы! Применены новые технологии и настройки.');
          }
        } catch (error) {
          alert(`❌ Ошибка импорта: ${error.message}`);
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  const handleResetData = () => {
    if (window.confirm(
      '⚠️ ВНИМАНИЕ: Это действие удалит ВСЕ технологии и вернет их к начальному состоянию. ' +
      'Это действие нельзя отменить. Продолжить?'
    )) {
      updateTechnologies([...initialTechnologies]);
      
      alert('✅ Данные сброшены. Возвращены начальные технологии.');
    }
  };

  const handleManualSave = () => {
    localStorage.setItem('technologies', JSON.stringify(technologies));
    localStorage.setItem('app-settings', JSON.stringify(settings));
    alert('✅ Все данные сохранены в вашем браузере.');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ⚙️ Настройки приложения
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Все настройки автоматически сохраняются в вашем браузере
      </Alert>

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
              onChange={handleThemeChange}  // Используем новый обработчик
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
              secondary={`Автозакрытие через ${notificationSettings.duration / 1000} сек`} 
            />
            <Switch
              checked={settings.notifications}
              onChange={handleSettingChange('notifications')}
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
              onChange={handleSettingChange('autoSave')}
              color="primary"
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 Управление данными
        </Typography>
        
        <Stack spacing={2}>
          <Button
            startIcon={<BackupIcon />}
            onClick={handleExportData}
            variant="contained"
            color="primary"
            fullWidth
          >
            Экспорт всех данных ({technologies.length} технологий)
          </Button>
          
          <Button
            startIcon={<CloudUploadIcon />}
            onClick={handleImportData}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Импорт данных из файла
          </Button>
          
          <Button
            startIcon={<SaveIcon />}
            onClick={handleManualSave}
            variant="outlined"
            color="secondary"
            fullWidth
          >
            Ручное сохранение данных
          </Button>
          
          <Divider sx={{ my: 2 }} />
          
          <Button
            startIcon={<DeleteForeverIcon />}
            onClick={handleResetData}
            variant="outlined"
            color="error"
            fullWidth
          >
            Сбросить все технологии ({initialTechnologies.length} начальных)
          </Button>
        </Stack>
        
        <Alert severity="warning" sx={{ mt: 2 }}>
          Экспорт включает все технологии и настройки. Импорт заменит текущие данные.
        </Alert>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          startIcon={<RestoreIcon />}
          onClick={handleResetSettings}
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