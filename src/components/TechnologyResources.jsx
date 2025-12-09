// components/TechnologyResources.jsx
import { useState, useEffect, useRef } from 'react';
import './TechnologyResources.css';

function TechnologyResources({ technologyId, technologyTitle }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  
  const abortControllerRef = useRef(null);

  // Функция для загрузки ресурсов из API
  const fetchResources = async () => {
    if (!expanded) return;

    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Имитация запроса к API для получения ресурсов
      await new Promise(resolve => setTimeout(resolve, 800));

      // Мок данные ресурсов в зависимости от технологии
      const mockResourcesData = {
        'React': [
          {
            id: 1,
            title: 'Официальная документация React',
            url: 'https://react.dev',
            type: 'documentation',
            description: 'Полная документация на английском языке'
          },
          {
            id: 2,
            title: 'React на русском',
            url: 'https://ru.reactjs.org',
            type: 'documentation',
            description: 'Документация и туториалы на русском'
          },
          {
            id: 3,
            title: 'React Tutorial для начинающих',
            url: 'https://youtube.com/playlist?list=PLM7wFzahDYnGF4WqYaSuwnItYDEBakTDS',
            type: 'video',
            description: 'Видео курс по основам React'
          }
        ],
        'Node.js': [
          {
            id: 1,
            title: 'Официальный сайт Node.js',
            url: 'https://nodejs.org',
            type: 'documentation',
            description: 'Документация и загрузка'
          },
          {
            id: 2,
            title: 'Node.js Guides',
            url: 'https://nodejs.org/en/docs/guides/',
            type: 'tutorial',
            description: 'Руководства и примеры'
          }
        ],
        'Typescript': [
          {
            id: 1,
            title: 'TypeScript Handbook',
            url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
            type: 'documentation',
            description: 'Официальное руководство'
          }
        ]
      };

      // Получаем ресурсы для конкретной технологии или общие
      const techResources = mockResourcesData[technologyTitle] || [
        {
          id: 1,
          title: `Ресурсы для изучения ${technologyTitle}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(technologyTitle + ' tutorial')}`,
          type: 'search',
          description: 'Поиск обучающих материалов'
        },
        {
          id: 2,
          title: 'MDN Web Docs',
          url: 'https://developer.mozilla.org',
          type: 'documentation',
          description: 'Общая документация по веб-технологиям'
        }
      ];

      setResources(techResources);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Не удалось загрузить ресурсы');
        console.error('Ошибка загрузки ресурсов:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Загружаем ресурсы при раскрытии
  useEffect(() => {
    if (expanded) {
      fetchResources();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [expanded, technologyTitle]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'documentation': return '📚';
      case 'video': return '🎬';
      case 'tutorial': return '📝';
      case 'search': return '🔍';
      default: return '🔗';
    }
  };

  return (
    <div className="technology-resources">
      <button 
        onClick={toggleExpand}
        className="resources-toggle"
      >
        <span className="toggle-icon">{expanded ? '▼' : '▶'}</span>
        📚 Дополнительные ресурсы
      </button>
      
      {expanded && (
        <div className="resources-content">
          {loading ? (
            <div className="resources-loading">
              <div className="small-spinner"></div>
              <p>Загрузка ресурсов...</p>
            </div>
          ) : error ? (
            <div className="resources-error">
              <p>{error}</p>
              <button 
                onClick={fetchResources}
                className="retry-btn"
              >
                Повторить
              </button>
            </div>
          ) : (
            <>
              <div className="resources-header">
                <h4>Ресурсы для "{technologyTitle}"</h4>
                <span className="resources-count">{resources.length} ресурсов</span>
              </div>
              
              <div className="resources-list">
                {resources.map(resource => (
                  <div key={resource.id} className="resource-item">
                    <div className="resource-icon">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="resource-info">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        {resource.title}
                      </a>
                      <p className="resource-description">
                        {resource.description}
                      </p>
                      <span className="resource-type">{resource.type}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="resources-actions">
                <button 
                  onClick={fetchResources}
                  className="refresh-resources-btn"
                >
                  🔄 Обновить ресурсы
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TechnologyResources;