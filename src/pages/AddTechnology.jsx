import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './Pages.css';

function AddTechnology() {
  const navigate = useNavigate();
  const { technologies, setTechnologies } = useTechnologies();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    status: 'not-started',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название технологии');
      return;
    }

    const newTechnology = {
      id: Date.now(), // Простой ID на основе времени
      ...formData,
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

      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-section">
          <h3>📝 Основная информация</h3>
          
          <div className="form-group">
            <label htmlFor="title">Название технологии *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Например: React Hooks"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите технологию, что она из себя представляет, для чего используется..."
              rows="4"
              className="form-textarea"
            />
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
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Базы данных</option>
                <option value="devops">DevOps</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Начальный статус</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="not-started">⏳ Не начато</option>
                <option value="in-progress">🔄 В процессе</option>
                <option value="completed">✅ Изучено</option>
              </select>
            </div>
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
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">
            ← Отмена
          </button>
          <button type="submit" className="btn btn-primary">
            💾 Сохранить технологию
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTechnology;