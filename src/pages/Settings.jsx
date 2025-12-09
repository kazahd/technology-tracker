import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import DataImportExport from '../components/DataImportExport';
import './Pages.css';

function Settings() {
  const [notifications, setNotifications] = useLocalStorage('notifications', true);
  const [autoSave, setAutoSave] = useLocalStorage('autoSave', true);
  const [technologies, setTechnologies] = useLocalStorage('technologies', []);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: JSON.parse(localStorage.getItem('technologies') || '[]')
    };
    
    const dataStr = JSON.stringify(data, null, 2);
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

  const handleReset = () => {
    if (confirm('Вы уверены? Это удалит все ваши технологии.')) {
      localStorage.removeItem('technologies');
      alert('Данные сброшены. Страница будет перезагружена.');
      window.location.reload();
    }
  };

    return (
        <div className="page">
            <div className="page-header">
                <h1>⚙️ Настройки</h1>
                <p className="page-subtitle">Управление приложением</p>
            </div>

            <div className="settings-content">
                {/* Поведение */}
                <div className="settings-section">
                    <h3>⚡ Поведение</h3>
                    
                    <div className="behavior-settings">
                        <div className="behavior-item">
                            <div className="behavior-info">
                                <div className="behavior-title">Автосохранение</div>
                                <div className="behavior-description">
                                    Автоматически сохранять изменения
                                </div>
                            </div>
                            <div className="behavior-control">
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={autoSave}
                                        onChange={(e) => setAutoSave(e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="behavior-item">
                            <div className="behavior-info">
                                <div className="behavior-title">Уведомления</div>
                                <div className="behavior-description">
                                    Показывать уведомления о действиях
                                </div>
                            </div>
                            <div className="behavior-control">
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={notifications}
                                        onChange={(e) => setNotifications(e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Импорт и экспорт данных */}
                <div className="settings-section">
                    <h3>💾 Импорт и экспорт данных</h3>
                    <DataImportExport 
                        technologies={technologies}
                        setTechnologies={setTechnologies}
                    />
                </div>

                {/* Управление данными */}
                <div className="settings-section">
                    <h3>🗑️ Управление данными</h3>
                    
                    <div className="setting-item">
                        <button onClick={handleExport} className="btn btn-outline">
                            📤 Экспорт данных
                        </button>
                        <p className="setting-description">Скачать резервную копию</p>
                    </div>

                    <div className="setting-item">
                        <button onClick={handleReset} className="btn btn-danger">
                            🗑️ Сбросить данные
                        </button>
                        <p className="setting-description">
                            Удалить все технологии
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;