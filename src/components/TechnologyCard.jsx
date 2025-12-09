import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange }) {
  // Функция для переключения статуса
  const handleClick = () => {
    if (onStatusChange) {
      onStatusChange(id);
    }
  };

  // Текст для статуса
  const statusText = {
    'not-started': '⏳ Не начато',
    'in-progress': '🔄 В процессе',
    'completed': '✅ Изучено'
  };

  return (
    <div 
      className={`technology-card ${status}`}
      onClick={handleClick}
      title="Кликните, чтобы изменить статус"
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="status-indicator">
        {statusText[status]}
      </div>
    </div>
  );
}

export default TechnologyCard;