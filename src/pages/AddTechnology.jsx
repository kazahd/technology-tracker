import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import { useNotification } from '../hooks/useNotification';
import './Pages.css';

function AddTechnology() {
    const navigate = useNavigate();
    const { technologies, setTechnologies } = useTechnologies();
    const { showSuccess, showError } = useNotification();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        status: 'not-started',
        notes: '',
        difficulty: 'beginner',
        deadline: '',
        resources: ['']
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

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

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Название технологии обязательно';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Название должно содержать минимум 2 символа';
        } else if (formData.title.trim().length > 50) {
            newErrors.title = 'Название не должно превышать 50 символов';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Описание технологии обязательно';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Описание должно содержать минимум 10 символов';
        }

        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом';
            }
        }

        formData.resources.forEach((resource, index) => {
            if (resource && !isValidUrl(resource)) {
                newErrors[`resource_${index}`] = 'Введите корректный URL';
            }
        });

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };

    useEffect(() => {
        validateForm();
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResourceChange = (index, value) => {
        const newResources = [...formData.resources];
        newResources[index] = value;
        setFormData(prev => ({
            ...prev,
            resources: newResources
        }));
    };

    const addResourceField = () => {
        setFormData(prev => ({
            ...prev,
            resources: [...prev.resources, '']
        }));
    };

    const removeResourceField = (index) => {
        if (formData.resources.length > 1) {
            const newResources = formData.resources.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                resources: newResources
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!isFormValid) {
            showError('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        if (!formData.title.trim()) {
            showError('Пожалуйста, введите название технологии');
            return;
        }

        const cleanedData = {
            ...formData,
            resources: formData.resources.filter(resource => resource.trim() !== '')
        };

        const newTechnology = {
            id: Date.now(),
            ...cleanedData,
            createdAt: new Date().toISOString()
        };

        const updatedTechnologies = [...technologies, newTechnology];
        setTechnologies(updatedTechnologies);

        showSuccess(`Технология "${formData.title}" успешно добавлена!`, {
            label: 'Посмотреть',
            onClick: () => navigate('/technologies')
        });
        
        setTimeout(() => {
            navigate('/technologies');
        }, 2000);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>➕ Добавить новую технологию</h1>
                <p className="page-subtitle">Заполните информацию о технологии для изучения</p>
            </div>

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