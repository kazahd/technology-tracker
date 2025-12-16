// src/App.jsx
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import SimpleAuth from './components/SimpleAuth';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Technologies from './pages/Technologies';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Deadlines from './pages/Deadlines';
import NotificationSystem from './components/NotificationSystem';
import TechnologySearch from './components/TechnologySearch';
import RoadmapImporter from './components/RoadmapImporter';
import useTechnologiesApi from './hooks/useTechnologiesApi';
import './App.css';

// Компонент для защищенного маршрута настроек
const ProtectedSettings = ({ settings, setSettings, technologies, updateTechnologies, initialTechnologies, toggleTheme }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <SimpleAuth redirectPath="/settings" />;
  }

  return (
    <Settings 
      settings={settings}
      setSettings={setSettings}
      technologies={technologies}
      updateTechnologies={updateTechnologies}
      initialTechnologies={initialTechnologies}
      toggleTheme={toggleTheme}
    />
  );
};

// Компонент загрузки
const LoadingScreen = () => (
  <div className="app-loading" style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center'
  }}>
    <div className="spinner" style={{
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 2s linear infinite',
      marginBottom: '20px'
    }}></div>
    <p>Загрузка технологий из API...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Компонент ошибки
const ErrorScreen = ({ error, onRetry }) => (
  <div className="app-error" style={{
    padding: '40px',
    textAlign: 'center'
  }}>
    <h2>Произошла ошибка</h2>
    <p>{error}</p>
    <button 
      onClick={onRetry}
      style={{
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px'
      }}
    >
      Попробовать снова
    </button>
  </div>
);

function App() {
  // Используем API хук для загрузки данных (Шаг 3 из ТЗ)
  const { 
    technologies: apiTechnologies, 
    loading, 
    error, 
    refetch,
    addTechnology: addTechnologyViaApi 
  } = useTechnologiesApi();

  // Состояние для поиска
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Загружаем локальные технологии из localStorage
  const [localTechnologies, setLocalTechnologies] = useState(() => {
    const savedTechs = localStorage.getItem('technologies');
    return savedTechs ? JSON.parse(savedTechs) : [];
  });

  // Загружаем настройки из localStorage
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      darkMode: localStorage.getItem('theme-mode') === 'dark',
      notifications: true,
      autoSave: true,
      language: 'ru',
      useApi: true // Новая настройка: использовать API или локальные данные
    };
  });

  // Объединенные технологии: либо из API, либо локальные (в зависимости от настройки)
  const technologies = settings.useApi ? apiTechnologies : localTechnologies;
  const setTechnologies = settings.useApi 
    ? () => {} // Для API изменения через хук
    : setLocalTechnologies; // Для локальных

  // Сохраняем локальные технологии в localStorage при изменении
  useEffect(() => {
    if (!settings.useApi) {
      localStorage.setItem('technologies', JSON.stringify(localTechnologies));
    }
  }, [localTechnologies, settings.useApi]);

  // Сохраняем настройки в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    localStorage.setItem('theme-mode', settings.darkMode ? 'dark' : 'light');
  }, [settings]);

  // Обработчик поиска
  const handleSearch = (results) => {
    setSearchResults(results);
    setIsSearchActive(results.length > 0);
  };

  // Функция обновления технологий
  const updateTechnologies = (newTechnologies) => {
    if (settings.useApi) {
      // Для API - используем функции хука
      console.log('Обновление через API');
    } else {
      setLocalTechnologies(newTechnologies);
    }
  };

  // Функция обновления статуса технологии
  const updateTechnologyStatus = (techId, newStatus = null) => {
    if (settings.useApi) {
      // В реальном приложении здесь будет вызов API
      // Пока используем локальное обновление для демонстрации
      setLocalTechnologies(prev =>
        prev.map(tech => {
          if (tech.id === techId) {
            if (newStatus) {
              return { ...tech, status: newStatus };
            } else {
              const statusOrder = ['not-started', 'in-progress', 'completed'];
              const currentIndex = statusOrder.indexOf(tech.status);
              const nextIndex = (currentIndex + 1) % statusOrder.length;
              return { ...tech, status: statusOrder[nextIndex] };
            }
          }
          return tech;
        })
      );
    } else {
      setLocalTechnologies(prev =>
        prev.map(tech => {
          if (tech.id === techId) {
            if (newStatus) {
              return { ...tech, status: newStatus };
            } else {
              const statusOrder = ['not-started', 'in-progress', 'completed'];
              const currentIndex = statusOrder.indexOf(tech.status);
              const nextIndex = (currentIndex + 1) % statusOrder.length;
              return { ...tech, status: statusOrder[nextIndex] };
            }
          }
          return tech;
        })
      );
    }
  };

  // Функция обновления заметок
  const updateTechnologyNotes = (techId, newNotes) => {
    if (settings.useApi) {
      // В реальном приложении здесь будет вызов API
      setLocalTechnologies(prev =>
        prev.map(tech =>
          tech.id === techId ? { ...tech, notes: newNotes } : tech
        )
      );
    } else {
      setLocalTechnologies(prev =>
        prev.map(tech =>
          tech.id === techId ? { ...tech, notes: newNotes } : tech
        )
      );
    }
  };

  // Функция добавления технологии
  const addTechnology = async (techData) => {
    if (settings.useApi) {
      try {
        const newTech = await addTechnologyViaApi(techData);
        return newTech;
      } catch (err) {
        console.error('Ошибка добавления через API:', err);
        // Резервное локальное добавление
        const newTechnology = {
          id: Date.now(),
          ...techData,
          createdAt: new Date().toISOString()
        };
        setLocalTechnologies(prev => [...prev, newTechnology]);
        return newTechnology;
      }
    } else {
      const newTechnology = {
        id: Date.now(),
        ...techData,
        createdAt: new Date().toISOString()
      };
      setLocalTechnologies(prev => [...prev, newTechnology]);
      return newTechnology;
    }
  };

  // Функция массового обновления статусов
  const updateStatusBulk = (techIds, newStatus) => {
    if (settings.useApi) {
      // В реальном приложении здесь будет вызов API
      setLocalTechnologies(prev =>
        prev.map(tech => {
          if (techIds.includes(tech.id)) {
            return { ...tech, status: newStatus };
          }
          return tech;
        })
      );
    } else {
      setLocalTechnologies(prev =>
        prev.map(tech => {
          if (techIds.includes(tech.id)) {
            return { ...tech, status: newStatus };
          }
          return tech;
        })
      );
    }
  };

  // Функция переключения темы
  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  // Функция переключения режима API
  const toggleApiMode = () => {
    setSettings(prev => ({
      ...prev,
      useApi: !prev.useApi
    }));
  };

  // Создаем тему MUI
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

  // Показываем загрузку
  if (loading && settings.useApi) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Navigation 
                onToggleTheme={toggleTheme} 
                themeMode={settings.darkMode ? 'dark' : 'light'}
                onToggleApiMode={toggleApiMode}
                useApi={settings.useApi}
              />
              
              <main className="main-content">
                {/* Компонент поиска с debounce (Пример 2 из ТЗ) */}
                
                
                {/* Компонент импорта дорожных карт из API (Шаг 2 из ТЗ) */}
                

                {/* Показываем ошибку если есть */}
                {error && settings.useApi && (
                  <ErrorScreen error={error} onRetry={refetch} />
                )}
                
                <Routes>
                  {/* Редиректы для неправильных путей */}
                  <Route path="/technology-tracker" element={
                    <Home 
                      technologies={isSearchActive ? searchResults : technologies}
                      updateTechnologyStatus={updateTechnologyStatus}
                      useApi={settings.useApi}
                    />
                  } />
                  <Route path="/technology-tracker/" element={
                    <Home 
                      technologies={isSearchActive ? searchResults : technologies}
                      updateTechnologyStatus={updateTechnologyStatus}
                      useApi={settings.useApi}
                    />
                  } />
                  
                  {/* Основные маршруты */}
                  <Route path="/" element={
                    <Home 
                      technologies={isSearchActive ? searchResults : technologies}
                      updateTechnologyStatus={updateTechnologyStatus}
                      useApi={settings.useApi}
                    />
                  } />
                  
                  <Route path="/technologies" element={
                    <Technologies 
                      technologies={isSearchActive ? searchResults : technologies}
                      updateTechnologyStatus={updateTechnologyStatus}
                      updateTechnologyNotes={updateTechnologyNotes}
                      updateStatusBulk={updateStatusBulk}
                      addTechnology={addTechnology}
                      useApi={settings.useApi}
                      onRefresh={settings.useApi ? refetch : null}
                    />
                  } />
                  
                  <Route path="/technology/:techId" element={
                    <TechnologyDetail 
                      technologies={technologies}
                      updateTechnologyStatus={updateTechnologyStatus}
                      updateTechnologyNotes={updateTechnologyNotes}
                      useApi={settings.useApi}
                    />
                  } />
                  
                  <Route path="/add" element={
                    <AddTechnology 
                      addTechnology={addTechnology}
                      technologies={technologies}
                      useApi={settings.useApi}
                    />
                  } />
                  
                  <Route path="/statistics" element={
                    <Statistics 
                      technologies={technologies}
                      useApi={settings.useApi}
                    />
                  } />

                  <Route path="/deadlines" element={
                    <Deadlines 
                      technologies={technologies}
                      useApi={settings.useApi}
                    />
                  } />
                  
                  {/* Защищенный маршрут настроек */}
                  <Route path="/settings" element={
                    <ProtectedSettings 
                      settings={settings}
                      setSettings={setSettings}
                      technologies={technologies}
                      updateTechnologies={updateTechnologies}
                      initialTechnologies={[]}
                      toggleTheme={toggleTheme}
                      useApi={settings.useApi}
                      onToggleApiMode={toggleApiMode}
                    />
                  } />
                  
                  {/* Редирект для старых маршрутов */}
                  <Route path="/add-technology" element={
                    <AddTechnology 
                      addTechnology={addTechnology}
                      technologies={technologies}
                      useApi={settings.useApi}
                    />
                  } />
                </Routes>
              </main>

              <NotificationSystem />

              <footer className="App-footer">
                <div className="footer-header">
                  <h3>🧠 Трекер изучения технологий</h3>
                  {settings.useApi && (
                    <button 
                      onClick={refetch}
                      className="refresh-btn"
                      style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Обновить из API
                    </button>
                  )}
                </div>
                <div className="footer-info">
                  <small>Тема: {settings.darkMode ? '🌙 Темная' : '☀️ Светлая'}</small>
                  <small>Режим: {settings.useApi ? '🌐 API' : '💾 Локальный'}</small>
                  <small>Технологий: {technologies.length}</small>
                  {error && settings.useApi && (
                    <small style={{color: '#e74c3c'}}>⚠️ Ошибка API</small>
                  )}
                </div>
              </footer>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;