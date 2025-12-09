import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyFilter from './components/TechnologyFilter';

function App() {
  // Состояние для массива технологий
  const [technologies, setTechnologies] = useState([
    { 
      id: 1, 
      title: 'React Components', 
      description: 'Изучение базовых компонентов React и их жизненного цикла', 
      status: 'completed' 
    },
    { 
      id: 2, 
      title: 'JSX Syntax', 
      description: 'Освоение синтаксиса JSX и его отличий от HTML', 
      status: 'in-progress' 
    },
    { 
      id: 3, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов и подъём состояния', 
      status: 'not-started' 
    },
    { 
      id: 4, 
      title: 'React Hooks', 
      description: 'Изучение useState, useEffect и создание собственных хуков', 
      status: 'not-started' 
    },
    { 
      id: 5, 
      title: 'React Router', 
      description: 'Настройка маршрутизации в React-приложениях', 
      status: 'in-progress' 
    },
    { 
      id: 6, 
      title: 'Context API', 
      description: 'Глобальное управление состоянием приложения', 
      status: 'not-started' 
    },
    { 
      id: 7, 
      title: 'Redux Toolkit', 
      description: 'Изучение современного стейт-менеджмента', 
      status: 'not-started' 
    },
    { 
      id: 8, 
      title: 'TypeScript с React', 
      description: 'Типизация React-приложений', 
      status: 'completed' 
    }
  ]);

  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');

  // Функция для изменения статуса технологии
  const handleStatusChange = (id) => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(tech => {
        if (tech.id === id) {
          // Циклическое переключение статусов
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...tech, status: statusOrder[nextIndex] };
        }
        return tech;
      })
    );
  };

  // Функция фильтрации технологий
  const filteredTechnologies = activeFilter === 'all' 
    ? technologies 
    : technologies.filter(tech => tech.status === activeFilter);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Трекер изучения технологий</h1>
        <p className="subtitle">Отслеживайте свой прогресс в изучении фронтенд-технологий</p>
      </header>

      <main>
        {/* Компонент прогресса */}
        <ProgressHeader technologies={technologies} />

        {/* Компонент быстрых действий */}
        <QuickActions 
          technologies={technologies}
          setTechnologies={setTechnologies}
        />

        {/* Компонент фильтрации */}
        <TechnologyFilter 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Информация о фильтрации */}
        <div className="filter-info">
          <p>
            Показано: <strong>{filteredTechnologies.length}</strong> из <strong>{technologies.length}</strong> технологий
            {activeFilter !== 'all' && ` (фильтр: ${getFilterLabel(activeFilter)})`}
          </p>
        </div>

        {/* Список карточек технологий */}
        <div className="technologies-list">
          {filteredTechnologies.length === 0 ? (
            <div className="empty-state">
              <h3>📭 Ничего не найдено</h3>
              <p>Нет технологий с выбранным статусом. Попробуйте другой фильтр.</p>
            </div>
          ) : (
            filteredTechnologies.map(tech => (
              <TechnologyCard
                key={tech.id}
                id={tech.id}
                title={tech.title}
                description={tech.description}
                status={tech.status}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>Трекер изучения технологий • Практическое занятие 20 • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

// Вспомогательная функция для получения названия фильтра
function getFilterLabel(filterKey) {
  const labels = {
    'all': 'Все',
    'not-started': 'Не начато',
    'in-progress': 'В процессе',
    'completed': 'Изучено'
  };
  return labels[filterKey] || filterKey;
}

export default App;