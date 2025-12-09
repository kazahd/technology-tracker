import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import ProgressBar from '../components/ProgressBar';
import './Pages.css';

function TechnologyDetail() {
  const { techId } = useParams();
  const navigate = useNavigate();
  const { technologies, updateStatus, updateNotes } = useTechnologies();
  
  const technology = technologies.find(tech => tech.id === parseInt(techId));

  const [notes, setNotes] = useState(technology?.notes || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!technology) {
    return (
      <div className="page">
        <div className="error-state">
          <h1>🚫 Технология не найдена</h1>
          <p>Технология с ID {techId} не существует или была удалена.</p>
          <div className="action-buttons">
            <Link to="/technologies" className="btn btn-primary">
              ← Вернуться к списку
            </Link>
            <Link to="/" className="btn btn-outline">
              На главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveNotes = () => {
    updateNotes(technology.id, notes);
    setIsEditing(false);
  };

  const getProgressByStatus = (status) => {
    switch (status) {
      case 'completed': return 100;
      case 'in-progress': return 50;
      case 'not-started': return 0;
      default: return 0;
    }
  };

  const statusLabels = {
    'not-started': { label: '⏳ Не начато', color: '#9e9e9e' },
    'in-progress': { label: '🔄 В процессе', color: '#ff9800' },
    'completed': { label: '✅ Изучено', color: '#4caf50' }
  };

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">
          ← Назад к списку
        </Link>
        <h1>{technology.title}</h1>
        <div className="page-actions">
          <button 
            onClick={() => updateStatus(technology.id)}
            className={`status-btn ${technology.status}`}
          >
            {statusLabels[technology.status].label}
          </button>
        </div>
      </div>

      <div className="detail-content">
        {/* Прогресс */}
        <div className="detail-section">
          <h3>📊 Прогресс изучения</h3>
          <ProgressBar
            progress={getProgressByStatus(technology.status)}
            height={20}
            color={statusLabels[technology.status].color}
            animated={true}
          />
          <div className="status-description">
            <p>
              {technology.status === 'not-started' && 'Эта технология еще не начата.'}
              {technology.status === 'in-progress' && 'Вы изучаете эту технологию.'}
              {technology.status === 'completed' && 'Вы успешно изучили эту технологию!'}
            </p>
          </div>
        </div>

        {/* Описание */}
        <div className="detail-section">
          <h3>📝 Описание</h3>
          <div className="description-content">
            <p>{technology.description}</p>
          </div>
        </div>

        {/* Заметки */}
        <div className="detail-section">
          <div className="section-header">
            <h3>📋 Мои заметки</h3>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn btn-outline">
                ✏️ Редактировать
              </button>
            ) : (
              <button onClick={handleSaveNotes} className="btn btn-primary">
                💾 Сохранить
              </button>
            )}
          </div>
          
          {isEditing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="notes-textarea"
              rows="6"
              placeholder="Добавьте заметки по этой технологии..."
            />
          ) : (
            <div className="notes-content">
              {technology.notes ? (
                <p>{technology.notes}</p>
              ) : (
                <p className="empty-notes">Заметок пока нет. Добавьте свои заметки!</p>
              )}
            </div>
          )}
        </div>

        {/* Быстрые действия */}
        <div className="detail-section">
          <h3>⚡ Быстрые действия</h3>
          <div className="quick-actions-row">
            <button 
              onClick={() => updateStatus(technology.id)}
              className="btn btn-primary"
            >
              Сменить статус
            </button>
            <button 
              onClick={() => navigate('/add')}
              className="btn btn-outline"
            >
              ➕ Добавить новую технологию
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;