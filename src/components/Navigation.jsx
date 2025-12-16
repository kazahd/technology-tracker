// src/components/Navigation.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import {
  Home as HomeIcon,
  LibraryBooks as LibraryBooksIcon,
  Add as AddIcon,
  Equalizer as EqualizerIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Person as PersonIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function Navigation({ onToggleTheme, themeMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, currentUser, logout } = useAuth();
  
  // Определяем активную вкладку по текущему пути
  const getTabValue = () => {
    const path = location.pathname;
    if (path === '/' || path === '/technology-tracker' || path === '/technology-tracker/') return 0;
    if (path === '/technologies') return 1;
    if (path === '/add' || path === '/add-technology') return 2;
    if (path === '/statistics') return 3;
    if (path === '/deadlines') return 4;
    if (path === '/settings') return 5;
    return 0;
  };

  const handleTabChange = (event, newValue) => {
    // Навигация будет через Link в Tab компонентах
  };

  const handleSettingsClick = (e) => {
    if (location.pathname === '/settings') {
      return;
    }
    e.preventDefault();
    navigate('/settings');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🎯 Трекер технологий
          </Typography>

          {/* Информация о пользователе */}
          {isAuthenticated && (
            <Box sx={{ 
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center', 
              mr: 2
            }}>
              <Avatar sx={{ 
                width: 32, 
                height: 32, 
                mr: 1, 
                bgcolor: 'primary.main',
                fontSize: '0.875rem'
              }}>
                {currentUser.charAt(0).toUpperCase() || <PersonIcon fontSize="small" />}
              </Avatar>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {currentUser || 'Пользователь'}
              </Typography>
            </Box>
          )}

          {/* Кнопка переключения темы */}
          <IconButton 
            onClick={onToggleTheme} 
            color="inherit" 
            sx={{ mr: 1 }}
            aria-label={themeMode === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
          >
            {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Кнопка выхода (только если авторизован) */}
          {isAuthenticated && (
            <IconButton 
              onClick={handleLogoutClick}
              color="inherit"
              title="Выйти из системы"
              aria-label="Выйти из системы"
            >
              <PersonIcon />
            </IconButton>
          )}
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
              icon={<EventIcon />}
              iconPosition="start"
              label={!isMobile ? "Дедлайны" : ""}
              component={Link}
              to="/deadlines"
              sx={{ minHeight: 64 }}
              aria-label="Управление дедлайнами"
            />
            <Tab 
              icon={<SettingsIcon />}
              iconPosition="start"
              label={!isMobile ? "Настройки" : ""}
              onClick={handleSettingsClick}
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