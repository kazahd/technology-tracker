// pages/Technologies.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyNotes from '../components/TechnologyNotes';
import TechnologyFilter from '../components/TechnologyFilter';
import RoadmapImporter from '../components/RoadmapImporter';
import TechnologySearch from '../components/TechnologySearch';
import TechnologyResources from '../components/TechnologyResources';
import './Pages.css';

function Technologies() {
  const { technologies, loading, error, refetch, addTechnology } = useTechnologiesApi();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [apiSearchResults, setApiSearchResults] = useState([]);

  const filteredTechnologies = activeFilter === 'all' 
    ? technologies 
    : technologies.filter(tech => tech.status === activeFilter);

  const searchedTechnologies = filteredTechnologies.filter(tech =>
    tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleApiSearchResults = (results) => {
    setApiSearchResults(results);
  };

  const handleAddFromApi = (tech) => {
    addTechnology({
      title: tech.title,
      description: tech.description,
      category: tech.category || 'other',
      status: 'not-started',
      notes: tech.notes || ''
    });
    alert(`Технология "${tech.title}" добавлена!`);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Загрузка технологий из API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-state">
          <h2>Произошла ошибка</h2>
          <p>{error}</p>
          <button onClick={refetch} className="btn btn-primary">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>📚 Все технологии</h1>
        <div className="page-actions">
          <Link to="/add" className="btn btn-primary">
            ➕ Добавить технологию
          </Link>
          <button onClick={refetch} className="btn btn-outline">
            🔄 Обновить из API
          </button>
        </div>
      </div>

      {/* Импорт дорожных карт из API */}
      <RoadmapImporter />

      {/* Поиск технологий в API с debounce */}
      <TechnologySearch onSearch={handleApiSearchResults} />

      {/* Результаты поиска из API */}
      {apiSearchResults.length > 0 && (
        <div className="api-results-section">
          <h3>🔍 Результаты поиска из API</h3>
          <div className="api-results">
            {apiSearchResults.map(tech => (
              <div key={tech.id} className="result-item">
                <h4>{tech.title}</h4>
                <p>{tech.description}</p>
                <button 
                  onClick={() => handleAddFromApi(tech)}
                  className="add-result-btn"
                >
                  📥 Добавить в трекер
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Фильтры и локальный поиск */}
      <div className="filters-section">
        <TechnologyFilter 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Поиск по названию, описанию или заметкам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-count">Найдено: {searchedTechnologies.length}</span>
        </div>
      </div>

      {/* Список технологий */}
      <div className="technologies-list">
        {searchedTechnologies.length === 0 ? (
          <div className="empty-state">
            <h3>📭 Технологий не найдено</h3>
            <p>
              {searchQuery || activeFilter !== 'all' 
                ? 'Попробуйте изменить поисковый запрос или фильтр'
                : 'Технологий пока нет'
              }
            </p>
            <Link to="/add" className="btn btn-primary">
              Добавить первую технологию
            </Link>
          </div>
        ) : (
          searchedTechnologies.map(tech => (
            <div key={tech.id} className="technology-card-wrapper">
              <TechnologyCard
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                onStatusChange={() => {}}
              />
              
              {/* Компонент для загрузки дополнительных ресурсов из API */}
              <TechnologyResources 
                technologyId={tech.id}
                technologyTitle={tech.title}
              />
              
              <TechnologyNotes
                notes={tech.notes}
                techId={tech.id}
                onNotesChange={() => {}}
              />
              
              <div className="card-actions">
                <Link to={`/technology/${tech.id}`} className="btn btn-outline">
                  📖 Подробнее
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Technologies;