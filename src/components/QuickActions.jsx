import './QuickActions.css';

function QuickActions({ technologies, setTechnologies }) {
  // 1. Отметить все как выполненные
  const markAllCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // 2. Сбросить все статусы
  const resetAll = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // 3. Случайный выбор следующей технологии
  const pickRandomTechnology = () => {
    const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
    
    if (notStartedTechs.length === 0) {
      alert('Все технологии уже начаты или изучены!');
      return;
    }

    const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
    const techName = randomTech.title;
    
    // Обновляем статус на "in-progress"
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === randomTech.id 
          ? { ...tech, status: 'in-progress' } 
          : tech
      )
    );
    
    alert(`Следующая технология для изучения: "${techName}"`);
  };

  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      <div className="action-buttons">
        <button onClick={markAllCompleted} className="action-btn complete-all">
          ✅ Отметить все как изученные
        </button>
        <button onClick={resetAll} className="action-btn reset-all">
          🔄 Сбросить все статусы
        </button>
        <button onClick={pickRandomTechnology} className="action-btn random-pick">
          🎲 Выбрать случайную технологию
        </button>
      </div>
    </div>
  );
}

export default QuickActions;