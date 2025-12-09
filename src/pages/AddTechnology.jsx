import { useState, useEffect } from 'react'; // Добавил useEffect
import { useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './Pages.css';

function AddTechnology() {
    const navigate = useNavigate();
    const { technologies, setTechnologies } = useTechnologies();
    
    // РАСШИРЯЕМ существующее состояние, добавляем новые поля из ТЗ
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        status: 'not-started',
        notes: '',
        // НОВЫЕ ПОЛЯ из ТЗ:
        difficulty: 'beginner',
        deadline: '',
        resources: ['']
    });

    // НОВОЕ: состояние для ошибок валидации
    const [errors, setErrors] = useState({});
    
    // НОВОЕ: флаг валидности формы
    const [isFormValid, setIsFormValid] = useState(false);

    // В начало компонента
useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            navigate('/technologies');
        }
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            if (isFormValid) {
                handleSubmit(e);
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, [isFormValid, navigate]);

    // НОВАЯ функция: проверка URL
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // НОВАЯ функция: валидация формы (из ТЗ)
    const validateForm = () => {
        const newErrors = {};

        // Валидация названия (улучшаем существующую)
        if (!formData.title.trim()) {
            newErrors.title = 'Название технологии обязательно';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Название должно содержать минимум 2 символа';
        } else if (formData.title.trim().length > 50) {
            newErrors.title = 'Название не должно превышать 50 символов';
        }

        // Валидация описания (улучшаем существующую)
        if (!formData.description.trim()) {
            newErrors.description = 'Описание технологии обязательно';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Описание должно содержать минимум 10 символов';
        }

        // НОВАЯ валидация: дедлайн (из ТЗ)
        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // обнуляем время

            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом';
            }
        }

        // НОВАЯ валидация: URL ресурсов
        formData.resources.forEach((resource, index) => {
            if (resource && !isValidUrl(resource)) {
                newErrors[`resource_${index}`] = 'Введите корректный URL';
            }
        });

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };

    // НОВОЕ: запуск валидации при изменениях
    useEffect(() => {
        validateForm();
    }, [formData]);

    // Сохраняем оригинальный обработчик, но улучшаем его
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // НОВАЯ функция: обработчик изменения ресурса
    const handleResourceChange = (index, value) => {
        const newResources = [...formData.resources];
        newResources[index] = value;
        setFormData(prev => ({
            ...prev,
            resources: newResources
        }));
    };

    // НОВАЯ функция: добавление поля ресурса
    const addResourceField = () => {
        setFormData(prev => ({
            ...prev,
            resources: [...prev.resources, '']
        }));
    };

    // НОВАЯ функция: удаление поля ресурса
    const removeResourceField = (index) => {
        if (formData.resources.length > 1) {
            const newResources = formData.resources.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                resources: newResources
            }));
        }
    };

    // Сохраняем оригинальный handleSubmit, но добавляем валидацию
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // НОВОЕ: проверка валидности формы
        if (!isFormValid) {
            alert('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        // Сохраняем оригинальную проверку
        if (!formData.title.trim()) {
            alert('Пожалуйста, введите название технологии');
            return;
        }

        // НОВОЕ: очищаем пустые ресурсы перед сохранением
        const cleanedData = {
            ...formData,
            resources: formData.resources.filter(resource => resource.trim() !== '')
        };

        const newTechnology = {
            id: Date.now(),
            ...cleanedData, // Используем очищенные данные
            createdAt: new Date().toISOString()
        };

        const updatedTechnologies = [...technologies, newTechnology];
        setTechnologies(updatedTechnologies);

        alert(`Технология "${formData.title}" успешно добавлена!`);
        navigate('/technologies');
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>➕ Добавить новую технологию</h1>
                <p className="page-subtitle">Заполните информацию о технологии для изучения</p>
            </div>

            {/* НОВОЕ: область для скринридера */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {!isFormValid ? 'Форма содержит ошибки' : 'Форма заполнена корректно'}
            </div>

            <form onSubmit={handleSubmit} className="add-form" noValidate>
                <div className="form-section">
                    <h3>📝 Основная информация</h3>
                    
                    {/* Улучшаем поле названия: добавляем ARIA и валидацию */}
                    <div className="form-group">
                        <label htmlFor="title" className="required">
                            Название технологии
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Например: React Hooks"
                            className={`form-input ${errors.title ? 'error' : ''}`}
                            aria-describedby={errors.title ? 'title-error' : undefined}
                            aria-required="true"
                            aria-invalid={!!errors.title}
                            required
                        />
                        {errors.title && (
                            <span id="title-error" className="error-message" role="alert">
                                {errors.title}
                            </span>
                        )}
                    </div>

                    {/* Улучшаем поле описания */}
                    <div className="form-group">
                        <label htmlFor="description" className="required">
                            Описание
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Опишите технологию, что она из себя представляет, для чего используется..."
                            rows="4"
                            className={`form-textarea ${errors.description ? 'error' : ''}`}
                            aria-describedby={errors.description ? 'description-error' : undefined}
                            aria-required="true"
                            aria-invalid={!!errors.description}
                            required
                        />
                        {errors.description && (
                            <span id="description-error" className="error-message" role="alert">
                                {errors.description}
                            </span>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Категория</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-select"
                                aria-label="Выберите категорию технологии"
                            >
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="database">Базы данных</option>
                                <option value="devops">DevOps</option>
                                <option value="other">Другое</option>
                            </select>
                        </div>

                        {/* НОВОЕ поле: сложность */}
                        <div className="form-group">
                            <label htmlFor="difficulty">Сложность</label>
                            <select
                                id="difficulty"
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                className="form-select"
                                aria-label="Выберите сложность изучения"
                            >
                                <option value="beginner">Начальный</option>
                                <option value="intermediate">Средний</option>
                                <option value="advanced">Продвинутый</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status">Начальный статус</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="form-select"
                                aria-label="Выберите начальный статус"
                            >
                                <option value="not-started">⏳ Не начато</option>
                                <option value="in-progress">🔄 В процессе</option>
                                <option value="completed">✅ Изучено</option>
                            </select>
                        </div>

                        {/* НОВОЕ поле: дедлайн */}
                        <div className="form-group">
                            <label htmlFor="deadline">Дедлайн (необязательно)</label>
                            <input
                                type="date"
                                id="deadline"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className={`form-input ${errors.deadline ? 'error' : ''}`}
                                aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                                aria-invalid={!!errors.deadline}
                                aria-label="Укажите дедлайн изучения"
                            />
                            {errors.deadline && (
                                <span id="deadline-error" className="error-message" role="alert">
                                    {errors.deadline}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* НОВЫЙ раздел: Ресурсы для изучения */}
                <div className="form-section">
                    <h3>📚 Ресурсы для изучения</h3>
                    <div className="form-group">
                        <label>Добавьте ссылки на полезные материалы (документация, туториалы)</label>
                        {formData.resources.map((resource, index) => (
                            <div key={index} className="resource-field">
                                <input
                                    type="url"
                                    value={resource}
                                    onChange={(e) => handleResourceChange(index, e.target.value)}
                                    placeholder="https://example.com/tutorial"
                                    className={`form-input ${errors[`resource_${index}`] ? 'error' : ''}`}
                                    aria-describedby={errors[`resource_${index}`] ? `resource-${index}-error` : undefined}
                                    aria-invalid={!!errors[`resource_${index}`]}
                                    aria-label={`Ресурс для изучения ${index + 1}`}
                                />
                                {formData.resources.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeResourceField(index)}
                                        className="btn-remove"
                                        aria-label={`Удалить ресурс ${index + 1}`}
                                        title="Удалить это поле с ресурсом"
                                    >
                                        Удалить
                                    </button>
                                )}
                                {errors[`resource_${index}`] && (
                                    <span id={`resource-${index}-error`} className="error-message" role="alert">
                                        {errors[`resource_${index}`]}
                                    </span>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addResourceField}
                            className="btn-add-resource"
                            aria-label="Добавить еще одно поле для ресурса"
                        >
                            + Добавить еще ресурс
                        </button>
                    </div>
                </div>

                <div className="form-section">
                    <h3>📋 Дополнительно</h3>
                    <div className="form-group">
                        <label htmlFor="notes">Первоначальные заметки</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Можете добавить начальные заметки, ссылки на ресурсы, план изучения..."
                            rows="3"
                            className="form-textarea"
                            aria-label="Ваши заметки по этой технологии"
                        />
                    </div>
                </div>
                
                <div className="keyboard-hints" role="note" aria-label="Подсказки по управлению с клавиатуры">
                    <small>
                        <strong>⌨️ Управление с клавиатуры:</strong> 
                        Ctrl+Enter (Cmd+Enter на Mac) - сохранить, 
                        Esc - отменить
                    </small>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/technologies')} className="btn btn-outline">
                        ← Отмена
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={!isFormValid}
                        aria-disabled={!isFormValid}
                    >
                        💾 Сохранить технологию
                    </button>
                </div>
            </form>

            {/* НОВОЕ: информация о доступности */}
            <div className="accessibility-info">
                <h3>♿ Доступность формы:</h3>
                <ul>
                    <li>Используйте Tab для перехода между полями</li>
                    <li>Ошибки валидации выделяются и объявляются скринридерами</li>
                    <li>Все поля имеют соответствующие ARIA-атрибуты</li>
                    <li>Кнопки доступны с клавиатуры</li>
                </ul>
            </div>
        </div>
    );
}

export default AddTechnology;