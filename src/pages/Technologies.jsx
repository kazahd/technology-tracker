import { Link } from 'react-router-dom';
import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies'; // Изменяем на useTechnologies
import TechnologyCard from '../components/TechnologyCard';
import TechnologyNotes from '../components/TechnologyNotes';
import TechnologyFilter from '../components/TechnologyFilter';
import RoadmapImporter from '../components/RoadmapImporter';
import TechnologySearch from '../components/TechnologySearch';
import TechnologyResources from '../components/TechnologyResources';
import BulkStatusEditor from '../components/BulkStatusEditor';
import './Pages.css';

function Technologies() {
    // Используем обычный хук useTechnologies вместо API
    const { technologies, updateStatus, updateNotes, updateStatusBulk } = useTechnologies();
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

    // Нужно получить addTechnology из хука, если используем useTechnologiesApi
    // Но если переходим на useTechnologies, нужно обновить RoadmapImporter
    
    // Функция для массового обновления статусов
    const handleBulkStatusUpdate = (techIds, newStatus) => {
        updateStatusBulk(techIds, newStatus);
    };

    // Убираем состояния loading и error, т.к. useTechnologies работает мгновенно
    
    // Обновляем RoadmapImporter чтобы использовать правильные функции
    // Нужно обновить RoadmapImporter.jsx или создать его локальную версию

    return (
        <div className="page">
            <div className="page-header">
                <h1>📚 Все технологии</h1>
                <div className="page-actions">
                    <Link to="/add" className="btn btn-primary">
                        ➕ Добавить технологию
                    </Link>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-outline"
                    >
                        🔄 Обновить страницу
                    </button>
                </div>
            </div>

            {/* Компонент массового редактирования */}
            <BulkStatusEditor 
                technologies={technologies}
                onUpdateStatusBulk={handleBulkStatusUpdate}
            />

            {/* Обновленный RoadmapImporter - нужны локальные функции */}
            <RoadmapImporterLocal 
                technologies={technologies}
                addTechnology={addTechnologyLocal}
            />

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
                                    onClick={() => handleAddFromApiLocal(tech)}
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
    technology={tech}
    onStatusChange={updateStatus}
                            />
                            
                            <TechnologyResources 
                                technologyId={tech.id}
                                technologyTitle={tech.title}
                            />
                            
                            <TechnologyNotes
                                notes={tech.notes}
                                techId={tech.id}
                                onNotesChange={updateNotes} // Исправлено: реальная функция
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

// Локальная функция для добавления технологии (временное решение)
const addTechnologyLocal = (techData) => {
    // Эту функцию нужно интегрировать с useTechnologies
    // Пока что оставим заглушку
    console.log('Добавление технологии:', techData);
    alert(`Технология "${techData.title}" будет добавлена после интеграции с хуком`);
};

// Локальная обработка добавления из API
const handleAddFromApiLocal = (tech) => {
    addTechnologyLocal({
        title: tech.title,
        description: tech.description,
        category: tech.category || 'other',
        status: 'not-started',
        notes: tech.notes || ''
    });
};

// Локальный компонент RoadmapImporter
function RoadmapImporterLocal({ technologies, addTechnology }) {
    const [importing, setImporting] = useState(false);

    const handleImportRoadmap = async () => {
        try {
            setImporting(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const roadmapData = {
                technologies: [
                    {
                        title: 'JavaScript ES6+',
                        description: 'Современные возможности JavaScript',
                        category: 'frontend',
                        difficulty: 'beginner',
                        resources: ['https://learn.javascript.ru', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'],
                        status: 'not-started',
                        notes: 'Важно изучить async/await, promises, деструктуризацию'
                    },
                    // ... остальные технологии
                ]
            };

            for (const tech of roadmapData.technologies) {
                await addTechnology(tech);
            }

            alert(`Успешно импортировано ${roadmapData.technologies.length} технологий`);
        } catch (err) {
            alert(`Ошибка импорта: ${err.message}`);
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="roadmap-importer">
            <h3>📋 Импорт дорожной карты</h3>
            <div className="import-actions">
                <button
                    onClick={handleImportRoadmap}
                    disabled={importing}
                    className="import-button"
                >
                    {importing ? 'Импорт...' : '📥 Импорт пример дорожной карты'}
                </button>
            </div>
        </div>
    );
}

export default Technologies;