// hooks/useTechnologiesApi.js
import { useState, useEffect } from 'react';

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка технологий из API
  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      setError(null);

      // В реальном приложении здесь будет запрос к вашему API
      // Сейчас имитируем загрузку с задержкой
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Мок данные - в реальном приложении замените на реальный API
      const mockTechnologies = [
        {
          id: 1,
          title: 'React',
          description: 'Библиотека для создания пользовательских интерфейсов',
          category: 'frontend',
          difficulty: 'beginner',
          resources: ['https://react.dev', 'https://ru.reactjs.org'],
          status: 'not-started',
          notes: ''
        },
        {
          id: 2,
          title: 'Node.js',
          description: 'Среда выполнения JavaScript на сервере',
          category: 'backend',
          difficulty: 'intermediate',
          resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/'],
          status: 'not-started',
          notes: ''
        },
        {
          id: 3,
          title: 'Typescript',
          description: 'Типизированное надмножество JavaScript',
          category: 'language',
          difficulty: 'intermediate',
          resources: ['https://www.typescriptlang.org'],
          status: 'not-started',
          notes: ''
        }
      ];

      setTechnologies(mockTechnologies);

    } catch (err) {
      setError('Не удалось загрузить технологии');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // Добавление новой технологии
  const addTechnology = async (techData) => {
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTech = {
        id: Date.now(), // В реальном приложении ID генерируется на сервере
        ...techData,
        createdAt: new Date().toISOString(),
        status: techData.status || 'not-started',
        notes: techData.notes || ''
      };

      setTechnologies(prev => [...prev, newTech]);
      return newTech;

    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  };

  // Функция для загрузки дополнительных ресурсов (Задание 2)
  const fetchTechnologyResources = async (techName) => {
    try {
      // Имитация API запроса для ресурсов
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const resourcesMap = {
        'React': ['https://react.dev', 'https://ru.reactjs.org'],
        'Node.js': ['https://nodejs.org', 'https://nodejs.org/en/docs/'],
        'Typescript': ['https://www.typescriptlang.org'],
        'JavaScript ES6+': ['https://learn.javascript.ru', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'],
        'CSS Grid & Flexbox': ['https://css-tricks.com/snippets/css/a-guide-to-flexbox/'],
        'Express.js': ['https://expressjs.com']
      };
      
      return resourcesMap[techName] || [];
    } catch (err) {
      console.error('Ошибка загрузки ресурсов:', err);
      return [];
    }
  };

  // Загружаем технологии при монтировании
  useEffect(() => {
    fetchTechnologies();
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    fetchTechnologyResources // ← Новая функция добавлена здесь
  };
}

export default useTechnologiesApi;