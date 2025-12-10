// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useMemo, useEffect, createContext, useContext } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Technologies from './pages/Technologies';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import NotificationSystem from './components/NotificationSystem';
import './App.css';

// Создаем контекст для настроек
const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

function App() {
  // Загружаем настройки из localStorage
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      darkMode: localStorage.getItem('theme-mode') === 'dark',
      notifications: true,
      autoSave: true,
      language: 'ru'
    };
  });

  // Создаем тему в зависимости от настроек
  const theme = useMemo(() => createTheme({
    palette: {
      mode: settings.darkMode ? 'dark' : 'light',
      primary: {
        main: settings.darkMode ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: settings.darkMode ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: settings.darkMode ? '#121212' : '#f5f5f5',
        paper: settings.darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: settings.darkMode 
              ? '0 2px 8px rgba(0,0,0,0.3)' 
              : '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  }), [settings.darkMode]);

  // Функция обновления настроек
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('app-settings', JSON.stringify(newSettings));
    // Также сохраняем тему отдельно для совместимости
    localStorage.setItem('theme-mode', newSettings.darkMode ? 'dark' : 'light');
  };

  // Функция переключения темы из Navigation
  const toggleTheme = () => {
    const newSettings = {
      ...settings,
      darkMode: !settings.darkMode
    };
    updateSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Navigation onToggleTheme={toggleTheme} themeMode={settings.darkMode ? 'dark' : 'light'} />
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/technologies" element={<Technologies />} />
                <Route path="/technology/:techId" element={<TechnologyDetail />} />
                <Route path="/add" element={<AddTechnology />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />
                
                <Route path="/add-technology" element={<AddTechnology />} />
              </Routes>
            </main>

            <NotificationSystem />

            <footer className="App-footer">
              <p>Трекер изучения технологий</p>
              <small>Тема: {settings.darkMode ? 'Темная' : 'Светлая'}</small>
            </footer>
          </div>
        </Router>
      </ThemeProvider>
    </SettingsContext.Provider>
  );
}

export default App; 