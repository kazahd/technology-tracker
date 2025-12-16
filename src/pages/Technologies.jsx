import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyNotes from '../components/TechnologyNotes';
import TechnologyFilter from '../components/TechnologyFilter';
import RoadmapImporter from '../components/RoadmapImporter';
import TechnologySearch from '../components/TechnologySearch';
import TechnologyResources from '../components/TechnologyResources';
import BulkStatusEditor from '../components/BulkStatusEditor';
import { useNotification } from '../hooks/useNotification';
import './Pages.css';

function Technologies({ 
  technologies: propTechnologies, 
  updateTechnologyStatus, 
  updateTechnologyNotes, 
  updateStatusBulk,
  addTechnology: propAddTechnology 
}) {
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  
  // Используем переданные пропсы или локальный хук
  const { 
    technologies: hookTechnologies, 
    updateStatus: hookUpdateStatus, 
    updateNotes: hookUpdateNotes, 
    updateStatusBulk: hookUpdateStatusBulk,
    addTechnology: hookAddTechnology 
  } = useTechnologies();
  
  // Определяем, какие данные использовать
  const technologies = propTechnologies || hookTechnologies;
  const updateStatus = updateTechnologyStatus || hookUpdateStatus;
  const updateNotes = updateTechnologyNotes || hookUpdateNotes;
  const bulkUpdateStatus = updateStatusBulk || hookUpdateStatusBulk;
  const addTechnology = propAddTechnology || hookAddTechnology;
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [apiSearchResults, setApiSearchResults] = useState([]);
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState([]);
  
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

  // Функция для изменения статуса одной технологии
  const handleStatusChange = (id, newStatus) => {
    const tech = technologies.find(t => t.id === id);
    if (!tech) return;
    
    // Обновляем статус
    if (updateStatus) {
      updateStatus(id, newStatus);
    }
    
    // Тексты статусов на русском
    const statusText = {
      'completed': 'Завершено',
      'in-progress': 'В процессе', 
      'not-started': 'Не начато'
    };
    
    const statusTextWithEmoji = {
      'completed': '✅ Завершено',
      'in-progress': '🔄 В процессе', 
      'not-started': '⏳ Не начато'
    };
    
    // Показываем уведомление
    showSuccess(
      `Статус "${tech.title}" изменен на "${statusText[newStatus]}"`,
      {
        label: 'Открыть',
        onClick: () => navigate(`/technology/${id}`)
      }
    );
  };

  // Функция для массового обновления статусов
  const handleBulkStatusUpdate = (techIds, newStatus) => {
    if (!bulkUpdateStatus) {
      showError('Функция массового обновления недоступна');
      return;
    }
    
    bulkUpdateStatus(techIds, newStatus);
    
    const statusText = {
      'completed': 'завершено',
      'in-progress': 'в процессе', 
      'not-started': 'не начато'
    };
    
    showSuccess(
      `Статус ${techIds.length} технологий изменен на "${statusText[newStatus]}"`,
      {
        label: 'Закрыть',
        onClick: () => setShowBulkEditor(false)
      }
    );
    
  
  };

  // Функция для добавления технологии из API результатов
  const handleAddFromApi = (apiTech) => {
    const newTech = {
      title: apiTech.title,
      description: apiTech.description,
      category: apiTech.category || 'other',
      status: 'not-started',
      notes: apiTech.notes || '',
      resources: apiTech.resources || [],
      difficulty: apiTech.difficulty || 'beginner'
    };
    
    if (addTechnology) {
      addTechnology(newTech);
      showSuccess(`Технология "${apiTech.title}" добавлена из API`);
    }
  };

  // Функция для выбора/снятия выбора технологии
  const toggleTechSelection = (techId) => {
    setSelectedTechs(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  // Функция для обновления заметок
  const handleNotesChange = (techId, newNotes) => {
    if (updateNotes) {
      updateNotes(techId, newNotes);
      const tech = technologies.find(t => t.id === techId);
      if (tech) {
        showSuccess(`Заметки для "${tech.title}" сохранены`);
      }
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>📚 Все технологии</h1>
        <div className="page-actions">
          <Link to="/add" className="btn btn-primary">
            ➕ Добавить технологию
          </Link>
          
          {technologies.length > 0 && (
            <button 
              onClick={() => setShowBulkEditor(!showBulkEditor)}
              className="btn btn-outline"
            >
              {showBulkEditor ? '✖️ Закрыть редактор' : '🔄 Массовое редактирование'}
            </button>
          )}
          
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-outline"
          >
            🔄 Обновить страницу
          </button>
        </div>
      </div>

      {/* Массовый редактор статусов */}
      {showBulkEditor && (
        <BulkStatusEditor 
          technologies={technologies}
          selectedTechs={selectedTechs}
          onClose={() => setShowBulkEditor(false)}
          updateStatusBulk={handleBulkStatusUpdate}
        />
      )}

      {/* Поиск технологий в API */}
      <TechnologySearch onSearch={handleApiSearchResults} />

      {/* Результаты поиска из API */}
      {apiSearchResults.length > 0 && (
        <div className="api-results-section">
          <h3>🔍 Результаты поиска из API</h3>
          <div className="api-results">
            {apiSearchResults.map(tech => (
              <div key={tech.id || tech.title} className="result-item">
                <h4>{tech.title}</h4>
                <p>{tech.description}</p>
                <button 
                  onClick={() => handleAddFromApi(tech)}
                  className="btn btn-outline"
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
              {/* Чекбокс для выбора (только при активном массовом редакторе) */}
              {showBulkEditor && (
                <div className="tech-selector">
                  <input
                    type="checkbox"
                    checked={selectedTechs.includes(tech.id)}
                    onChange={() => toggleTechSelection(tech.id)}
                    id={`select-${tech.id}`}
                  />
                  <label htmlFor={`select-${tech.id}`}>
                    Выбрать для массового редактирования
                  </label>
                </div>
              )}
              
              <TechnologyCard
                technology={tech}
                onStatusChange={(id, newStatus) => handleStatusChange(id, newStatus)}
              />
              
              <TechnologyResources 
                technologyId={tech.id}
                technologyTitle={tech.title}
              />
              
              <TechnologyNotes
                notes={tech.notes}
                techId={tech.id}
                onNotesChange={handleNotesChange}
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