import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
  { 
    id: 1, 
    title: 'React Components', 
    description: 'Изучение базовых компонентов React и их жизненного цикла', 
    status: 'completed',
    notes: 'Изучил основы компонентов, осталось разобрать HOC',
    category: 'frontend'
  },
  { 
    id: 2, 
    title: 'JSX Syntax', 
    description: 'Освоение синтаксиса JSX и его отличий от HTML', 
    status: 'in-progress',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 3, 
    title: 'State Management', 
    description: 'Работа с состоянием компонентов и подъём состояния', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 4, 
    title: 'React Hooks', 
    description: 'Изучение useState, useEffect и создание собственных хуков', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 5, 
    title: 'React Router', 
    description: 'Настройка маршрутизации в React-приложениях', 
    status: 'in-progress',
    notes: 'Разобрал BrowserRouter, перехожу к динамическим маршрутам',
    category: 'frontend'
  },
  { 
    id: 6, 
    title: 'Context API', 
    description: 'Глобальное управление состоянием приложения', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 7, 
    title: 'Redux Toolkit', 
    description: 'Изучение современного стейт-менеджмента', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 8, 
    title: 'TypeScript с React', 
    description: 'Типизация React-приложений', 
    status: 'completed',
    notes: 'Прошёл базовый курс, нужно практиковаться на реальном проекте',
    category: 'frontend'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  // Функция для обновления статуса технологии
  const updateStatus = (techId) => {
    setTechnologies(prev =>
      prev.map(tech => {
        if (tech.id === techId) {
          const statusOrder = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusOrder.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...tech, status: statusOrder[nextIndex] };
        }
        return tech;
      })
    );
  };

  // Функция для обновления заметок
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Функция для расчета общего прогресса
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  // Функции для быстрых действий
  const markAllCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const resetAll = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  const pickRandomTechnology = () => {
    const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
    
    if (notStartedTechs.length === 0) {
      alert('Все технологии уже начаты или изучены!');
      return null;
    }

    const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
    
    // Обновляем статус на "in-progress"
    updateStatus(randomTech.id);
    
    return randomTech;
  };

  return {
    technologies,
    setTechnologies,
    updateStatus,
    updateNotes,
    markAllCompleted,
    resetAll,
    pickRandomTechnology,
    progress: calculateProgress()
  };
}

export default useTechnologies;