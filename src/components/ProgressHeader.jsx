import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  // 1. Подсчитываем статистику
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;
  const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
  
  // 2. Вычисляем процент выполнения
  const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-header">
      <h2>📊 Прогресс изучения</h2>
      
      <div className="stats">
        <div className="stat-item">
          <span className="stat-number">{total}</span>
          <span className="stat-label">Всего технологий</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number">{completed}</span>
          <span className="stat-label">Изучено</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number">{inProgress}</span>
          <span className="stat-label">В процессе</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number">{notStarted}</span>
          <span className="stat-label">Не начато</span>
        </div>
      </div>
      
      {/* Прогресс-бар */}
      <div className="progress-container">
        <div className="progress-label">
          Общий прогресс: <strong>{progressPercentage}%</strong>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;