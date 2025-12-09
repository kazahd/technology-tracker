// components/DataImportExport.jsx
import { useState, useEffect } from 'react';
import './DataImportExport.css';

function DataImportExport({ technologies, setTechnologies }) {
    const [status, setStatus] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    // Функция для валидации импортируемых данных
    const validateImportedData = (data) => {
        const errors = [];
        
        // Проверяем, что данные - массив
        if (!Array.isArray(data)) {
            errors.push('Данные должны быть массивом');
            return errors;
        }

        // Проверяем каждую технологию
        data.forEach((tech, index) => {
            if (!tech.title || typeof tech.title !== 'string') {
                errors.push(`Технология #${index + 1}: отсутствует или некорректное название`);
            }
            
            if (!tech.description || typeof tech.description !== 'string') {
                errors.push(`Технология #${index + 1}: отсутствует или некорректное описание`);
            }
            
            const validStatuses = ['not-started', 'in-progress', 'completed'];
            if (!tech.status || !validStatuses.includes(tech.status)) {
                errors.push(`Технология #${index + 1}: некорректный статус. Должен быть: ${validStatuses.join(', ')}`);
            }
            
            if (tech.notes && typeof tech.notes !== 'string') {
                errors.push(`Технология #${index + 1}: заметки должны быть строкой`);
            }
        });

        return errors;
    };

    // Экспорт данных в JSON-файл
    const exportToJSON = () => {
        try {
            const exportData = {
                exportedAt: new Date().toISOString(),
                version: '1.0',
                technologiesCount: technologies.length,
                technologies: technologies.map(tech => ({
                    id: tech.id,
                    title: tech.title,
                    description: tech.description,
                    status: tech.status,
                    notes: tech.notes || '',
                    category: tech.category || 'other',
                    difficulty: tech.difficulty || 'beginner',
                    deadline: tech.deadline || '',
                    resources: tech.resources || [],
                    createdAt: tech.createdAt || new Date().toISOString()
                }))
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `technology-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatus(`✅ Успешно экспортировано ${technologies.length} технологий`);
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            setStatus('❌ Ошибка при экспорте данных');
            console.error('Ошибка экспорта:', error);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    // Импорт данных из JSON-файла
    const importFromJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                
                // Проверяем структуру файла
                if (!imported.technologies || !Array.isArray(imported.technologies)) {
                    throw new Error('Неверный формат файла: отсутствует массив technologies');
                }

                // Валидируем данные
                const errors = validateImportedData(imported.technologies);
                
                if (errors.length > 0) {
                    setValidationErrors(errors);
                    setStatus('❌ Обнаружены ошибки в данных');
                    return;
                }

                // Очищаем предыдущие ошибки
                setValidationErrors([]);
                
                // Подготавливаем данные для импорта
                const preparedTechnologies = imported.technologies.map(tech => ({
                    ...tech,
                    id: tech.id || Date.now() + Math.random(),
                    createdAt: tech.createdAt || new Date().toISOString(),
                    notes: tech.notes || '',
                    category: tech.category || 'other',
                    difficulty: tech.difficulty || 'beginner',
                    deadline: tech.deadline || '',
                    resources: tech.resources || []
                }));

                // Устанавливаем новые технологии (заменяем существующие)
                setTechnologies(preparedTechnologies);
                setStatus(`✅ Успешно импортировано ${preparedTechnologies.length} технологий`);
                setTimeout(() => setStatus(''), 3000);

            } catch (error) {
                setStatus(`❌ Ошибка импорта: ${error.message}`);
                console.error('Ошибка импорта:', error);
                setTimeout(() => setStatus(''), 3000);
            }
        };

        reader.onerror = () => {
            setStatus('❌ Ошибка чтения файла');
            setTimeout(() => setStatus(''), 3000);
        };

        reader.readAsText(file);
        event.target.value = '';
    };

    // Обработчики drag-and-drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    
                    if (imported.technologies && Array.isArray(imported.technologies)) {
                        const errors = validateImportedData(imported.technologies);
                        
                        if (errors.length > 0) {
                            setValidationErrors(errors);
                            setStatus('❌ Обнаружены ошибки в данных (drag & drop)');
                            return;
                        }

                        const preparedTechnologies = imported.technologies.map(tech => ({
                            ...tech,
                            id: tech.id || Date.now() + Math.random(),
                            createdAt: tech.createdAt || new Date().toISOString()
                        }));

                        setTechnologies(preparedTechnologies);
                        setStatus(`✅ Импортировано ${preparedTechnologies.length} технологий (drag & drop)`);
                        setTimeout(() => setStatus(''), 3000);
                    } else {
                        throw new Error('Неверный формат данных');
                    }
                } catch (error) {
                    setStatus('❌ Ошибка импорта: неверный формат файла');
                }
            };
            reader.readAsText(file);
        } else {
            setStatus('❌ Поддерживаются только JSON файлы');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    // Очистка ошибок валидации
    const clearValidationErrors = () => {
        setValidationErrors([]);
    };

    // Проверка возможности экспорта
    const canExport = technologies.length > 0;

    return (
        <div className="data-import-export" role="region" aria-labelledby="import-export-title">
            <h3 id="import-export-title">💾 Импорт и экспорт данных</h3>
            
            {/* Сообщения о статусе */}
            {status && (
                <div 
                    className={`status-message ${status.includes('✅') ? 'success' : 'error'}`}
                    role={status.includes('❌') ? 'alert' : 'status'}
                    aria-live="polite"
                >
                    {status}
                </div>
            )}

            {/* Ошибки валидации */}
            {validationErrors.length > 0 && (
                <div className="validation-errors" role="alert" aria-live="assertive">
                    <h4>Обнаружены ошибки в данных:</h4>
                    <ul>
                        {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                    <button 
                        onClick={clearValidationErrors}
                        className="btn-clear-errors"
                        aria-label="Очистить список ошибок"
                    >
                        Очистить ошибки
                    </button>
                </div>
            )}

            {/* Панель управления */}
            <div className="import-export-controls">
                <button 
                    onClick={exportToJSON} 
                    disabled={!canExport}
                    className="export-btn"
                    aria-label={`Экспортировать ${technologies.length} технологий в JSON файл`}
                >
                    📤 Экспорт в JSON {canExport && `(${technologies.length})`}
                </button>

                <label className="file-input-label">
                    📥 Импорт из JSON
                    <input
                        type="file"
                        accept=".json,application/json"
                        onChange={importFromJSON}
                        aria-label="Выберите JSON файл для импорта данных"
                    />
                </label>
            </div>

            {/* Область drag-and-drop */}
            <div
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex="0"
                aria-label="Перетащите JSON файл сюда для импорта"
            >
                📁 Перетащите JSON-файл сюда или кликните для выбора
            </div>

            {/* Информация о формате */}
            <div className="format-info" role="contentinfo">
                <details>
                    <summary>Требования к формату файла</summary>
                    <div className="format-details">
                        <p>JSON файл должен содержать объект с массивом <code>technologies</code>:</p>
                        <pre>{`{
  "technologies": [
    {
      "title": "Название технологии",
      "description": "Описание",
      "status": "not-started|in-progress|completed",
      "notes": "Заметки (опционально)",
      "category": "Категория (опционально)",
      "difficulty": "beginner|intermediate|advanced (опционально)",
      "deadline": "YYYY-MM-DD (опционально)",
      "resources": ["url1", "url2"] (опционально)
    }
  ]
}`}</pre>
                        <p><strong>Обязательные поля:</strong> title, description, status</p>
                    </div>
                </details>
            </div>

            {/* Статистика */}
            <div className="data-stats">
                <p>
                    <strong>Статистика данных:</strong> Технологий: {technologies.length} | 
                    Изучено: {technologies.filter(t => t.status === 'completed').length} | 
                    В процессе: {technologies.filter(t => t.status === 'in-progress').length} | 
                    Не начато: {technologies.filter(t => t.status === 'not-started').length}
                </p>
            </div>
        </div>
    );
}

export default DataImportExport;