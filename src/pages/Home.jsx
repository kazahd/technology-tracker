// pages/Home.jsx
import { Link } from 'react-router-dom';
import ProgressHeader from '../components/ProgressHeader';
import QuickActions from '../components/QuickActions';
import useTechnologies from '../hooks/useTechnologies';
import './Pages.css';

function Home() {
  const { 
    technologies, 
    markAllCompleted, 
    resetAll, 
    pickRandomTechnology,
    progress 
  } = useTechnologies();

  const recentTechnologies = technologies.slice(0, 3);

  // Функция для перевода статуса на русский
  const getStatusInRussian = (status) => {
    switch(status) {
      case 'completed': return 'изучено';
      case 'in-progress': return 'в процессе';
      case 'not-started': return 'не начато';
      default: return status;
    }
  };

  // Функция для получения эмодзи статуса
  const getStatusEmoji = (status) => {
    switch(status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'not-started': return '⏳';
      default: return '';
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Добро пожаловать в Трекер технологий! 🎯</h1>
        <p className="page-subtitle">Отслеживайте свой прогресс в изучении фронтенд-технологий</p>
      </div>

      <div className="home-content">
        {/* Быстрый доступ */}
        <div className="quick-access">
          <h2>⚡ Быстрый доступ</h2>
          <div className="quick-access-grid">
            <Link to="/technologies" className="quick-access-card">
              <div className="card-icon">📚</div>
              <h3>Все технологии</h3>
              <p>Просмотр всех технологий ({technologies.length})</p>
            </Link>
            <Link to="/add" className="quick-access-card">
              <div className="card-icon">➕</div>
              <h3>Добавить технологию</h3>
              <p>Добавьте новую технологию для изучения</p>
            </Link>
            <Link to="/statistics" className="quick-access-card">
              <div className="card-icon">📊</div>
              <h3>Статистика</h3>
              <p>Анализ вашего прогресса</p>
            </Link>
          </div>
        </div>

        {/* Прогресс */}
        <ProgressHeader technologies={technologies} />

        {/* Быстрые действия */}
        <QuickActions 
          technologies={technologies}
          markAllCompleted={markAllCompleted}
          resetAll={resetAll}
          pickRandomTechnology={pickRandomTechnology}
        />

        {/* Недавние технологии */}
        <div className="recent-technologies">
          <div className="section-header">
            <h2>🔄 Недавние технологии</h2>
            <Link to="/technologies" className="view-all">Посмотреть все →</Link>
          </div>
          
          {recentTechnologies.length > 0 ? (
            <div className="technologies-grid">
              {recentTechnologies.map(tech => (
                <Link to={`/technology/${tech.id}`} key={tech.id} className="technology-card-link">
                  <div className={`technology-card-preview ${tech.status}`}>
                    <h3>{tech.title}</h3>
                    <p>{tech.description.substring(0, 100)}...</p>
                    <div className="status-badge">
                      {getStatusEmoji(tech.status)} {getStatusInRussian(tech.status)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Технологий пока нет. <Link to="/add">Добавьте первую!</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;