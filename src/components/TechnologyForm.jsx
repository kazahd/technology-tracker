// components/TechnologyForm.jsx
import { useState, useEffect } from 'react';
import './TechnologyForm.css';

function TechnologyForm({ onSave, onCancel, initialData = {} }) {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'frontend',
        difficulty: initialData.difficulty || 'beginner',
        deadline: initialData.deadline || '',
        resources: initialData.resources || [''],
        status: initialData.status || 'not-started',
        notes: initialData.notes || ''
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Функция для скринридера
    const [statusMessage, setStatusMessage] = useState('');

    // Проверка корректности URL
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Функция валидации
    const validateForm = () => {
        const newErrors = {};

        // Валидация названия
        if (!formData.title.trim()) {
            newErrors.title = 'Название технологии обязательно';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Название должно содержать минимум 2 символа';
        } else if (formData.title.trim().length > 50) {
            newErrors.title = 'Название не должно превышать 50 символов';
        }

        // Валидация описания
        if (!formData.description.trim()) {
            newErrors.description = 'Описание технологии обязательно';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Описание должно содержать минимум 10 символов';
        }

        // Валидация дедлайна
        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом';
            }
        }

        // Валидация ресурсов
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

    // Обработчик изменения полей
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Обработчик изменения ресурсов
    const handleResourceChange = (index, value) => {
        const newResources = [...formData.resources];
        newResources[index] = value;
        setFormData(prev => ({
            ...prev,
            resources: newResources
        }));
    };

    // Добавление поля ресурса
    const addResourceField = () => {
        setFormData(prev => ({
            ...prev,
            resources: [...prev.resources, '']
        }));
    };

    // Удаление поля ресурса
    const removeResourceField = (index) => {
        if (formData.resources.length > 1) {
            const newResources = formData.resources.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                resources: newResources
            }));
        }
    };

    // Обработчик отправки
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid) {
            setStatusMessage('Форма содержит ошибки. Исправьте их перед отправкой.');
            return;
        }

        setIsSubmitting(true);
        setStatusMessage('Отправка формы...');

        try {
            // Очищаем пустые ресурсы
            const cleanedData = {
                ...formData,
                resources: formData.resources.filter(resource => resource.trim() !== '')
            };

            // Имитация задержки для демонстрации
            await new Promise(resolve => setTimeout(resolve, 500));
            
            onSave(cleanedData);
            setStatusMessage('Форма успешно отправлена!');
            
        } catch (error) {
            setStatusMessage('Ошибка при отправке формы');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Обработчик отмены
    const handleCancel = () => {
        if (window.confirm('Вы уверены? Все несохраненные изменения будут потеряны.')) {
            onCancel();
        }
    };

    // Обработчик нажатия клавиш для навигации
    const handleKeyDown = (e) => {
        // ESC для отмены
        if (e.key === 'Escape') {
            handleCancel();
        }
        // Ctrl+Enter для отправки
        if (e.key === 'Enter' && e.ctrlKey) {
            if (isFormValid && !isSubmitting) {
                handleSubmit(e);
            }
        }
    };

    return (
        <div onKeyDown={handleKeyDown}>
            {/* Область для скринридера */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {statusMessage}
                {isSubmitting && 'Отправка формы...'}
            </div>

            <form onSubmit={handleSubmit} className="technology-form" noValidate>
                <h2>{initialData.title ? 'Редактирование технологии' : 'Добавление новой технологии'}</h2>

                {/* Поле названия */}
                <div className="form-group">
                    <label htmlFor="title" className="required">
                        Название технологии
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        className={errors.title ? 'error' : ''}
                        placeholder="Например: React Hooks"
                        aria-describedby={errors.title ? 'title-error' : undefined}
                        aria-required="true"
                        aria-invalid={!!errors.title}
                        aria-label="Название технологии"
                        required
                        autoFocus
                    />
                    {errors.title && (
                        <div id="title-error" className="error-message" role="alert" aria-live="assertive">
                            {errors.title}
                        </div>
                    )}
                </div>

                {/* Поле описания */}
                <div className="form-group">
                    <label htmlFor="description" className="required">
                        Описание
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className={errors.description ? 'error' : ''}
                        placeholder="Опишите технологию..."
                        aria-describedby={errors.description ? 'description-error' : undefined}
                        aria-required="true"
                        aria-invalid={!!errors.description}
                        aria-label="Описание технологии"
                        required
                    />
                    {errors.description && (
                        <div id="description-error" className="error-message" role="alert" aria-live="assertive">
                            {errors.description}
                        </div>
                    )}
                </div>

                <div className="form-row">
                    {/* Категория */}
                    <div className="form-group">
                        <label htmlFor="category">Категория</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            aria-label="Выберите категорию"
                        >
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="database">База данных</option>
                            <option value="devops">DevOps</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>

                    {/* Сложность */}
                    <div className="form-group">
                        <label htmlFor="difficulty">Сложность</label>
                        <select
                            id="difficulty"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            aria-label="Выберите сложность"
                        >
                            <option value="beginner">Начальный</option>
                            <option value="intermediate">Средний</option>
                            <option value="advanced">Продвинутый</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    {/* Статус */}
                    <div className="form-group">
                        <label htmlFor="status">Статус</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            aria-label="Выберите статус"
                        >
                            <option value="not-started">⏳ Не начато</option>
                            <option value="in-progress">🔄 В процессе</option>
                            <option value="completed">✅ Изучено</option>
                        </select>
                    </div>

                    {/* Дедлайн */}
                    <div className="form-group">
                        <label htmlFor="deadline">Дедлайн (необязательно)</label>
                        <input
                            id="deadline"
                            name="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={handleChange}
                            className={errors.deadline ? 'error' : ''}
                            aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                            aria-invalid={!!errors.deadline}
                            aria-label="Дедлайн изучения"
                        />
                        {errors.deadline && (
                            <div id="deadline-error" className="error-message" role="alert" aria-live="assertive">
                                {errors.deadline}
                            </div>
                        )}
                    </div>
                </div>

                {/* Ресурсы */}
                <div className="form-group">
                    <label>Ресурсы для изучения</label>
                    <div className="resources-info" role="note" aria-label="Информация о ресурсах">
                        Добавьте ссылки на полезные материалы (документация, туториалы)
                    </div>
                    {formData.resources.map((resource, index) => (
                        <div key={index} className="resource-field">
                            <input
                                type="url"
                                value={resource}
                                onChange={(e) => handleResourceChange(index, e.target.value)}
                                placeholder="https://example.com/tutorial"
                                className={errors[`resource_${index}`] ? 'error' : ''}
                                aria-describedby={errors[`resource_${index}`] ? `resource-${index}-error` : undefined}
                                aria-invalid={!!errors[`resource_${index}`]}
                                aria-label={`Ресурс ${index + 1}`}
                            />
                            {formData.resources.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeResourceField(index)}
                                    className="btn-remove"
                                    aria-label={`Удалить ресурс ${index + 1}`}
                                    title="Удалить ресурс"
                                >
                                    ×
                                </button>
                            )}
                            {errors[`resource_${index}`] && (
                                <div id={`resource-${index}-error`} className="error-message" role="alert" aria-live="assertive">
                                    {errors[`resource_${index}`]}
                                </div>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addResourceField}
                        className="btn-add-resource"
                        aria-label="Добавить новый ресурс"
                    >
                        + Добавить ресурс
                    </button>
                </div>

                {/* Заметки */}
                <div className="form-group">
                    <label htmlFor="notes">Заметки</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Добавьте заметки, идеи, план изучения..."
                        aria-label="Заметки по технологии"
                    />
                </div>

                {/* Кнопки */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-secondary"
                        aria-label="Отменить добавление технологии"
                    >
                        Отмена (Esc)
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={!isFormValid || isSubmitting}
                        aria-disabled={!isFormValid || isSubmitting}
                        aria-label={isSubmitting ? 'Отправка формы...' : 'Сохранить технологию'}
                    >
                        {isSubmitting ? 'Сохранение...' : 'Сохранить (Ctrl+Enter)'}
                    </button>
                </div>

                {/* Подсказки по клавиатуре */}
                <div className="keyboard-hints" role="note" aria-label="Подсказки по управлению с клавиатуры">
                    <small>
                        <strong>Подсказки:</strong> Esc - отмена, Ctrl+Enter - сохранить, Tab - переход между полями
                    </small>
                </div>
            </form>
        </div>
    );
}

export default TechnologyForm;