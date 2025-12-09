import useTechnologies from '../hooks/useTechnologies';
import ProgressBar from '../components/ProgressBar';
import './Pages.css';

function Statistics() {
  const { technologies, progress } = useTechnologies();

  const calculateStats = () => {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;
    
    const categories = {};
    technologies.forEach(tech => {
      const category = tech.category || 'other';
      categories[category] = (categories[category] || 0) + 1;
    });

    return { total, completed, inProgress, notStarted, categories };
  };

  const stats = calculateStats();

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 Статистика изучения</h1>
        <p className="page-subtitle">Анализ вашего прогресса в изучении технологий</p>
      </div>

      <div className="stats-content">
        {/* Основная статистика */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Всего технологий</div>
          </div>

          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Изучено</div>
          </div>

          <div className="stat-card in-progress">
            <div className="stat-icon">🔄</div>
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">В процессе</div>
          </div>

          <div className="stat-card not-started">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{stats.notStarted}</div>
            <div className="stat-label">Не начато</div>
          </div>
        </div>

        {/* Общий прогресс */}
        <div className="stats-section">
          <h3>📈 Общий прогресс</h3>
          <ProgressBar
            progress={progress}
            label={`Изучено ${stats.completed} из ${stats.total} технологий`}
            color="#667eea"
            height={25}
            animated={true}
            showPercentage={true}
          />
        </div>

        {/* Распределение по категориям */}
        {Object.keys(stats.categories).length > 0 && (
          <div className="stats-section">
            <h3>🏷️ Распределение по категориям</h3>
            <div className="categories-list">
              {Object.entries(stats.categories).map(([category, count]) => {
                const percentage = Math.round((count / stats.total) * 100);
                return (
                  <div key={category} className="category-item">
                    <div className="category-header">
                      <span className="category-name">{category}</span>
                      <span className="category-count">{count} ({percentage}%)</span>
                    </div>
                    <ProgressBar
                      progress={percentage}
                      height={12}
                      color="#9C27B0"
                      showPercentage={false}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Статусы */}
        <div className="stats-section">
          <h3>🎯 Состояние изучения</h3>
          <div className="status-chart">
            <div className="chart-item">
              <div className="chart-label">✅ Изучено</div>
              <div className="chart-bar">
                <div 
                  className="chart-fill completed" 
                  style={{ width: `${(stats.completed / stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="chart-value">{stats.completed}</div>
            </div>
            <div className="chart-item">
              <div className="chart-label">🔄 В процессе</div>
              <div className="chart-bar">
                <div 
                  className="chart-fill in-progress" 
                  style={{ width: `${(stats.inProgress / stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="chart-value">{stats.inProgress}</div>
            </div>
            <div className="chart-item">
              <div className="chart-label">⏳ Не начато</div>
              <div className="chart-bar">
                <div 
                  className="chart-fill not-started" 
                  style={{ width: `${(stats.notStarted / stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="chart-value">{stats.notStarted}</div>
            </div>
          </div>
        </div>

        {/* Советы */}
        {stats.notStarted > 0 && (
          <div className="tips-section">
            <h3>💡 Советы по улучшению прогресса</h3>
            <ul className="tips-list">
              {stats.notStarted > 0 && (
                <li>Начните изучать одну из {stats.notStarted} не начатых технологий</li>
              )}
              {stats.inProgress > 0 && (
                <li>Продолжайте работу над {stats.inProgress} технологиями в процессе изучения</li>
              )}
              {stats.completed > 0 && (
                <li>Вы уже изучили {stats.completed} технологий! Отличная работа!</li>
              )}
              {progress < 50 && (
                <li>Старайтесь уделять изучению хотя бы 30 минут в день</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;