import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import './Pages.css';

function Settings() {
  const [theme, setTheme] = useLocalStorage('appTheme', 'light');
  const [notifications, setNotifications] = useLocalStorage('notifications', true);
  const [autoSave, setAutoSave] = useLocalStorage('autoSave', true);
  
  const [exportData, setExportData] = useState('');

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      settings: { theme, notifications, autoSave },
      technologies: JSON.parse(localStorage.getItem('technologies') || '[]')
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    setExportData(dataStr);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-tracker-backup-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (data.settings) {
          if (confirm('Импортировать настройки?')) {
            setTheme(data.settings.theme || theme);
            setNotifications(data.settings.notifications ?? notifications);
            setAutoSave(data.settings.autoSave ?? autoSave);
          }
        }
        
        if (data.technologies && confirm('Импортировать технологии?')) {
          localStorage.setItem('technologies', JSON.stringify(data.technologies));
          alert('Технологии успешно импортированы! Страница будет перезагружена.');
          window.location.reload();
        }
      } catch (error) {
        alert('Ошибка при импорте файла: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Вы уверены? Это удалит все ваши технологии и сбросит настройки.')) {
      localStorage.clear();
      alert('Все данные сброшены. Страница будет перезагружена.');
      window.location.reload();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>⚙️ Настройки приложения</h1>
        <p className="page-subtitle">Настройте трекер под свои предпочтения</p>
      </div>

      <div className="settings-content">
        {/* Внешний вид */}
        <div className="settings-section">
          <h3>🎨 Внешний вид</h3>
          <div className="setting-item">
            <label>Тема оформления</label>
            <div className="theme-options">
              <button 
                onClick={() => setTheme('light')}
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              >
                ☀️ Светлая
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              >
                🌙 Темная
              </button>
              <button 
                onClick={() => setTheme('auto')}
                className={`theme-option ${theme === 'auto' ? 'active' : ''}`}
              >
                🔄 Авто
              </button>
            </div>
          </div>
        </div>

        {/* Поведение */}
        <div className="settings-section">
          <h3>⚡ Поведение</h3>
          <div className="setting-item">
            <label className="switch-label">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="switch-input"
              />
              <span className="switch-slider"></span>
              <span className="switch-text">Автосохранение</span>
            </label>
            <p className="setting-description">Автоматически сохранять изменения</p>
          </div>

          <div className="setting-item">
            <label className="switch-label">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="switch-input"
              />
              <span className="switch-slider"></span>
              <span className="switch-text">Уведомления</span>
            </label>
            <p className="setting-description">Показывать уведомления о действиях</p>
          </div>
        </div>

        {/* Управление данными */}
        <div className="settings-section">
          <h3>💾 Управление данными</h3>
          
          <div className="setting-item">
            <label>Экспорт данных</label>
            <button onClick={handleExport} className="btn btn-outline">
              📤 Экспортировать все данные
            </button>
            <p className="setting-description">Скачайте резервную копию всех ваших данных</p>
          </div>

          <div className="setting-item">
            <label>Импорт данных</label>
            <div className="import-section">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="file-input"
                id="import-file"
              />
              <label htmlFor="import-file" className="btn btn-outline">
                📥 Выбрать файл для импорта
              </label>
            </div>
            <p className="setting-description">Восстановите данные из резервной копии</p>
          </div>

          <div className="setting-item danger">
            <label>Опасная зона</label>
            <button onClick={handleReset} className="btn btn-danger">
              🗑️ Сбросить все данные
            </button>
            <p className="setting-description danger-text">
              Удалит все технологии и настройки. Действие необратимо!
            </p>
          </div>
        </div>

        {/* Информация */}
        <div className="settings-section">
          <h3>ℹ️ Информация</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Версия приложения:</strong> 2.0.0
            </div>
            <div className="info-item">
              <strong>Данные хранятся в:</strong> localStorage
            </div>
            <div className="info-item">
              <strong>Всего технологий:</strong> {JSON.parse(localStorage.getItem('technologies') || '[]').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;