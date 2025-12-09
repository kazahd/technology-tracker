import { Link } from 'react-router-dom';
import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyNotes from '../components/TechnologyNotes';
import TechnologyFilter from '../components/TechnologyFilter';
import './Pages.css';

function Technologies() {
  const { technologies, updateStatus, updateNotes } = useTechnologies();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTechnologies = activeFilter === 'all' 
    ? technologies 
    : technologies.filter(tech => tech.status === activeFilter);

  const searchedTechnologies = filteredTechnologies.filter(tech =>
    tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>📚 Все технологии</h1>
        <div className="page-actions">
          <Link to="/add" className="btn btn-primary">
            ➕ Добавить технологию
          </Link>
        </div>
      </div>

      {/* Фильтры и поиск */}
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
                onStatusChange={updateStatus}
              />
              <TechnologyNotes
                notes={tech.notes}
                techId={tech.id}
                onNotesChange={updateNotes}
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