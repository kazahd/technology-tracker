import './TechnologyFilter.css';

function TechnologyFilter({ activeFilter, setActiveFilter }) {
  const filters = [
    { key: 'all', label: 'Все', emoji: '📚' },
    { key: 'not-started', label: 'Не начато', emoji: '⏳' },
    { key: 'in-progress', label: 'В процессе', emoji: '🔄' },
    { key: 'completed', label: 'Изучено', emoji: '✅' }
  ];

  return (
    <div className="technology-filter">
      <h3>🔍 Фильтр по статусу</h3>
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
          >
            {filter.emoji} {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TechnologyFilter;