// components/TechnologySearch.jsx
import { useState, useEffect, useRef } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const searchTechnologies = async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);

      if (!query.trim()) {
        onSearch([]);
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      const mockResults = [
        {
          id: Date.now() + 1,
          title: `Результат для "${query}"`,
          description: 'Пример технологии найденной через API',
          category: 'frontend',
          status: 'not-started',
          notes: ''
        },
        {
          id: Date.now() + 2,
          title: `Другой результат "${query}"`,
          description: 'Еще одна технология из внешнего источника',
          category: 'backend',
          status: 'not-started',
          notes: ''
        }
      ];

      onSearch(mockResults);

    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Ошибка при поиске технологий:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchTechnologies(value);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="technology-search">
      <h3>🔍 Поиск технологий в API</h3>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Введите название технологии для поиска в API..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          disabled={loading}
        />
        {loading && <span className="search-loading">⏳</span>}
      </div>
      
      <p className="search-hint">
        Поиск работает с задержкой 500ms и отменой предыдущих запросов
      </p>
    </div>
  );
}

export default TechnologySearch;