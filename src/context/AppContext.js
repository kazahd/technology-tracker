// src/context/AppContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

const initialTechnologies = [
  { 
    id: 1, 
    title: 'React Components', 
    description: 'Изучение базовых компонентов React и их жизненного цикла', 
    status: 'completed',
    notes: 'Изучил основы компонентов, осталось разобрать HOC',
    category: 'frontend'
  },
  // ... остальные начальные технологии
];

export const AppProvider = ({ children }) => {
  const [technologies, setTechnologies] = useState(() => {
    const savedTechs = localStorage.getItem('technologies');
    return savedTechs ? JSON.parse(savedTechs) : initialTechnologies;
  });

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      darkMode: localStorage.getItem('theme-mode') === 'dark',
      notifications: true,
      autoSave: true,
      language: 'ru'
    };
  });

  useEffect(() => {
    localStorage.setItem('technologies', JSON.stringify(technologies));
  }, [technologies]);

  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    localStorage.setItem('theme-mode', settings.darkMode ? 'dark' : 'light');
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const updateTechnologies = (newTechnologies) => {
    setTechnologies(newTechnologies);
  };

  const toggleTheme = () => {
    const newSettings = {
      ...settings,
      darkMode: !settings.darkMode
    };
    updateSettings(newSettings);
  };

  const value = {
    settings,
    updateSettings,
    technologies,
    updateTechnologies,
    initialTechnologies,
    toggleTheme
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};