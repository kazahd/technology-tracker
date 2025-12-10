// src/components/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryBooksIcon,
  Add as AddIcon,
  Equalizer as EqualizerIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';

function Navigation({ onToggleTheme, themeMode }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Определяем активную вкладку по текущему пути
  const getTabValue = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/technologies') return 1;
    if (path === '/add' || path === '/add-technology') return 2;
    if (path === '/statistics') return 3;
    if (path === '/settings') return 4;
    return 0;
  };

  const handleTabChange = (event, newValue) => {
    // Навигация будет через Link в Tab компонентах
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🎯 Трекер технологий
          </Typography>

          {/* Кнопка переключения темы */}
          <IconButton 
            onClick={onToggleTheme} 
            color="inherit" 
            sx={{ mr: 1 }}
            aria-label={themeMode === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
          >
            {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Иконка уведомлений с бейджем как в Dashboard из ТЗ */}
          <IconButton color="inherit" aria-label="Уведомления">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>

        {/* Вкладки навигации */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={getTabValue()} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            aria-label="навигационные вкладки"
            textColor="inherit"
          >
            <Tab 
              icon={<HomeIcon />} 
              iconPosition="start"
              label={!isMobile ? "Главная" : ""}
              component={Link}
              to="/"
              sx={{ minHeight: 64 }}
              aria-label="Главная страница"
            />
            <Tab 
              icon={<LibraryBooksIcon />}
              iconPosition="start"
              label={!isMobile ? "Все технологии" : ""}
              component={Link}
              to="/technologies"
              sx={{ minHeight: 64 }}
              aria-label="Все технологии"
            />
            <Tab 
              icon={<AddIcon />}
              iconPosition="start"
              label={!isMobile ? "Добавить технологию" : ""}
              component={Link}
              to="/add"
              sx={{ minHeight: 64 }}
              aria-label="Добавить технологию"
            />
            <Tab 
              icon={<EqualizerIcon />}
              iconPosition="start"
              label={!isMobile ? "Статистика" : ""}
              component={Link}
              to="/statistics"
              sx={{ minHeight: 64 }}
              aria-label="Статистика"
            />
            <Tab 
              icon={<SettingsIcon />}
              iconPosition="start"
              label={!isMobile ? "Настройки" : ""}
              component={Link}
              to="/settings"
              sx={{ minHeight: 64 }}
              aria-label="Настройки"
            />
          </Tabs>
        </Box>
      </AppBar>
    </>
  );
}

export default Navigation;