import { useState } from 'react';
import './QuickActions.css';
import Modal from './Modal';

function QuickActions({ technologies, markAllCompleted, resetAll, pickRandomTechnology }) {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: technologies
    };
    const dataStr = JSON.stringify(data, null, 2);
    
    // Создаем Blob и ссылку для скачивания
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `technology-tracker-export-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportModal(true);
  };

  const handleRandomPick = () => {
    const randomTech = pickRandomTechnology();
    if (randomTech) {
      alert(`🎲 Следующая технология для изучения: "${randomTech.title}"`);
    }
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
        <button onClick={handleRandomPick} className="action-btn random-pick">
          🎲 Выбрать случайную технологию
        </button>
        <button onClick={handleExport} className="action-btn export-btn">
          📤 Экспорт данных
        </button>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
      >
        <div className="export-modal-content">
          <p>✅ Данные успешно экспортированы!</p>
          <p>Файл с данными был скачан на ваш компьютер.</p>
          <p className="export-hint">
            <small>Формат: JSON, содержит все технологии с их статусами и заметками</small>
          </p>
          <button 
            className="action-btn"
            onClick={() => setShowExportModal(false)}
            style={{ marginTop: '15px' }}
          >
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;