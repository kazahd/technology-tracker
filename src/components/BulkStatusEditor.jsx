// components/BulkStatusEditor.jsx
import { useState, useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';
import './BulkStatusEditor.css';

function BulkStatusEditor({ 
  technologies = [], 
  selectedTechs = [], 
  onClose, 
  updateStatusBulk 
}) {
    const [selectedTechIds, setSelectedTechIds] = useState([]);
    const [newStatus, setNewStatus] = useState('not-started');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const { showSuccess, showError } = useNotification();
    
    // Инициализируем выбранные технологии из пропсов
    useEffect(() => {
        if (selectedTechs && selectedTechs.length > 0) {
            setSelectedTechIds(selectedTechs);
        }
    }, [selectedTechs]);

    // Выбор всех технологий
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = technologies.map(tech => tech.id);
            setSelectedTechIds(allIds);
            setStatusMessage(`Выбрано всех технологий: ${technologies.length}`);
        } else {
            setSelectedTechIds([]);
            setStatusMessage('Выбор снят');
        }
    };

    // Выбор отдельной технологии
    const handleSelectTech = (techId) => {
        setSelectedTechIds(prev => {
            let newSelected;
            if (prev.includes(techId)) {
                newSelected = prev.filter(id => id !== techId);
            } else {
                newSelected = [...prev, techId];
            }
            
            // Обновляем сообщение для скринридера
            setStatusMessage(`Выбрано технологий: ${newSelected.length}`);
            return newSelected;
        });
    };

    // Применение нового статуса
    const handleApplyStatus = async () => {
        if (selectedTechIds.length === 0) {
            showError('Выберите хотя бы одну технологию для изменения статуса');
            return;
        }

        if (!updateStatusBulk || typeof updateStatusBulk !== 'function') {
            showError('Функция массового обновления недоступна');
            return;
        }

        setIsSubmitting(true);
        setStatusMessage('Применение изменений...');

        try {
            // Имитация асинхронной операции
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Применяем статус ко всем выбранным
            updateStatusBulk(selectedTechIds, newStatus);
            
            // Показываем уведомление
            const statusText = {
                'completed': 'завершено',
                'in-progress': 'в процессе', 
                'not-started': 'не начато'
            };
            
            showSuccess(
                `Статус ${selectedTechIds.length} технологий изменен на "${statusText[newStatus]}"`
            );
            
            // Сбрасываем выбор, но НЕ закрываем окно
            setSelectedTechIds([]);
            setStatusMessage(`✓ Статус успешно изменен для ${selectedTechIds.length} технологий. Выбор сброшен.`);
            
        } catch (error) {
            console.error('Ошибка при изменении статусов:', error);
            showError('Ошибка при изменении статусов: ' + error.message);
            setStatusMessage('✗ Ошибка при изменении статусов');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Сбросить выбранные технологии
    const handleResetSelection = () => {
        setSelectedTechIds([]);
        setStatusMessage('Выбор сброшен');
    };

    // Получение текста статуса
    const getStatusText = (status) => {
        switch (status) {
            case 'not-started': return 'Не начато';
            case 'in-progress': return 'В процессе';
            case 'completed': return 'Изучено';
            default: return status;
        }
    };

    // Получение эмодзи статуса
    const getStatusEmoji = (status) => {
        switch (status) {
            case 'not-started': return '⏳';
            case 'in-progress': return '🔄';
            case 'completed': return '✅';
            default: return '';
        }
    };

    // Кнопка закрытия
    const handleClose = () => {
        if (onClose) onClose();
    };

    return (
        <div className="bulk-status-editor" role="region" aria-labelledby="bulk-editor-title">
            <div className="bulk-editor-header">
                <h3 id="bulk-editor-title">📝 Массовое редактирование статусов</h3>
                <button 
                    onClick={handleClose}
                    className="close-btn"
                    aria-label="Закрыть редактор массового редактирования"
                    title="Закрыть"
                >
                    ✕
                </button>
            </div>
            
            {/* Сообщения для скринридера */}
            <div 
                role="status" 
                aria-live="polite" 
                aria-atomic="true" 
                className="sr-only"
            >
                {statusMessage}
                {isSubmitting && 'Применение изменений...'}
            </div>

            {/* Визуальное сообщение о статусе */}
            {statusMessage && (
                <div 
                    className={`status-feedback ${statusMessage.includes('✗') ? 'error' : 'success'}`}
                    role="alert"
                    aria-live="assertive"
                >
                    {statusMessage}
                </div>
            )}

            {/* Панель управления */}
            <div className="bulk-controls">
                <div className="status-selector">
                    <label htmlFor="bulk-status-select">
                        Установить статус для выбранных:
                    </label>
                    <select
                        id="bulk-status-select"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        aria-label="Выберите новый статус для выбранных технологий"
                        disabled={isSubmitting}
                    >
                        <option value="not-started">⏳ Не начато</option>
                        <option value="in-progress">🔄 В процессе</option>
                        <option value="completed">✅ Изучено</option>
                    </select>
                </div>

                <div className="bulk-actions">
                    <button
                        onClick={handleApplyStatus}
                        disabled={selectedTechIds.length === 0 || isSubmitting}
                        className="apply-btn"
                        aria-busy={isSubmitting}
                        aria-label={`Применить статус "${getStatusText(newStatus)}" к ${selectedTechIds.length} выбранным технологиям`}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner" aria-hidden="true"></span>
                                Применение...
                            </>
                        ) : (
                            `✅ Применить к ${selectedTechIds.length} технологиям`
                        )}
                    </button>
                    
                    
                    
                    
                </div>
            </div>

            {/* Список технологий */}
            <div className="technologies-bulk-list">
                <div className="list-header" role="row">
                    <div className="header-cell select-all-cell">
                        <input
                            type="checkbox"
                            id="select-all-tech"
                            checked={selectedTechIds.length === technologies.length && technologies.length > 0}
                            onChange={handleSelectAll}
                            aria-label="Выбрать все технологии"
                            disabled={technologies.length === 0}
                        />
                        <label htmlFor="select-all-tech" className="select-all-label">
                            Выбрать все ({technologies.length})
                        </label>
                    </div>
                    <div className="header-cell">Название</div>
                    <div className="header-cell">Текущий статус</div>
                </div>

                <div className="list-body" role="list" aria-label="Список технологий для массового редактирования">
                    {technologies.map(tech => {
                        const isSelected = selectedTechIds.includes(tech.id);
                        return (
                            <div 
                                key={tech.id} 
                                className={`tech-bulk-item ${isSelected ? 'selected' : ''}`}
                                role="listitem"
                                aria-selected={isSelected}
                            >
                                <div className="tech-cell select-cell">
                                    <input
                                        type="checkbox"
                                        id={`tech-checkbox-${tech.id}`}
                                        checked={isSelected}
                                        onChange={() => handleSelectTech(tech.id)}
                                        aria-label={`Выбрать технологию "${tech.title}"`}
                                    />
                                </div>
                                
                                <div className="tech-cell title-cell">
                                    <label htmlFor={`tech-checkbox-${tech.id}`} className="tech-title">
                                        {tech.title}
                                    </label>
                                    <span className="tech-category">{tech.category}</span>
                                </div>
                                
                                <div className="tech-cell status-cell">
                                    <span className={`current-status ${tech.status}`}>
                                        {getStatusEmoji(tech.status)} {getStatusText(tech.status)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {technologies.length === 0 && (
                        <div className="empty-list" role="alert">
                            <p>📭 Технологий пока нет. Добавьте технологии для массового редактирования.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Статистика */}
            {technologies.length > 0 && (
                <div className="bulk-stats" role="contentinfo">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-label">Всего технологий:</span>
                            <span className="stat-value">{technologies.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Выбрано:</span>
                            <span className="stat-value selected-count">{selectedTechIds.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Новый статус:</span>
                            <span className="stat-value new-status-badge">
                                {getStatusEmoji(newStatus)} {getStatusText(newStatus)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BulkStatusEditor;