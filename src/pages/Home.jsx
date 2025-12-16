// pages/Home.jsx
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  PlayCircle as PlayCircleIcon,
  AccessTime as AccessTimeIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import ProgressHeader from '../components/ProgressHeader';
import QuickActions from '../components/QuickActions';
import useTechnologies from '../hooks/useTechnologies';
import './Pages.css';

function Home() {
  const { 
    technologies, 
    markAllCompleted, 
    resetAll, 
    pickRandomTechnology,
    progress,
    updateStatus
  } = useTechnologies();

  const recentTechnologies = technologies.slice(0, 3);

  // Функция для перевода статуса на русский
  const getStatusInRussian = (status) => {
    switch(status) {
      case 'completed': return 'изучено';
      case 'in-progress': return 'в процессе';
      case 'not-started': return 'не начато';
      default: return status;
    }
  };

  // Функция для получения цвета статуса
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'not-started': return 'default';
      default: return 'default';
    }
  };

  // Функция для получения следующего статуса
  const getNextStatus = (currentStatus) => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  };

  // Обработчик изменения статуса
  const handleStatusChange = (techId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    updateStatus(techId);
    
    // Можно добавить уведомление здесь
    console.log(`Статус изменен на: ${nextStatus}`);
  };

  // Функция для получения иконки действия
  const getActionIcon = (status) => {
    switch(status) {
      case 'not-started': return <PlayCircleIcon />;
      case 'in-progress': return <CheckCircleIcon />;
      case 'completed': return <AccessTimeIcon />;
      default: return <MoreVertIcon />;
    }
  };

  // Текст для кнопки действия
  const getActionText = (status) => {
    switch(status) {
      case 'not-started': return 'Начать';
      case 'in-progress': return 'Завершить';
      case 'completed': return 'Сбросить';
      default: return 'Изменить';
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Добро пожаловать в Трекер технологий! 🎯</h1>
        <p className="page-subtitle">Отслеживайте свой прогресс в изучении фронтенд-технологий</p>
      </div>

      <div className="home-content">
        {/* Прогресс */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6">Общий прогресс</Typography>
            <Typography variant="h6">{progress}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        {/* Быстрый доступ */}
        <div className="quick-access">
          <h2>⚡ Быстрый доступ</h2>
          <div className="quick-access-grid">
            <Link to="/technologies" className="quick-access-card">
              <div className="card-icon">📚</div>
              <h3>Все технологии</h3>
              <p>Просмотр всех технологий ({technologies.length})</p>
            </Link>
            <Link to="/add" className="quick-access-card">
              <div className="card-icon">➕</div>
              <h3>Добавить технологию</h3>
              <p>Добавьте новую технологию для изучения</p>
            </Link>
            <Link to="/statistics" className="quick-access-card">
              <div className="card-icon">📊</div>
              <h3>Статистика</h3>
              <p>Анализ вашего прогресса</p>
            </Link>
          </div>
        </div>

        {/* Быстрые действия */}
        <QuickActions 
          technologies={technologies}
          markAllCompleted={markAllCompleted}
          resetAll={resetAll}
          pickRandomTechnology={pickRandomTechnology}
        />

        {/* Недавние технологии */}
        <div className="recent-technologies">
          <div className="section-header">
            <h2>🔄 Недавние технологии</h2>
            <Link to="/technologies" className="view-all">Посмотреть все →</Link>
          </div>
          
          {recentTechnologies.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentTechnologies.map(tech => (
                <Card key={tech.id} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" component="h3">
                          {tech.title}
                        </Typography>
                        <Chip 
                          label={getStatusInRussian(tech.status)}
                          color={getStatusColor(tech.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {tech.description.substring(0, 120)}...
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title={getActionText(tech.status)}>
                        <IconButton
                          color={getStatusColor(tech.status)}
                          onClick={() => handleStatusChange(tech.id, tech.status)}
                          sx={{ 
                            border: '1px solid',
                            borderColor: getStatusColor(tech.status) === 'default' ? '#ccc' : undefined
                          }}
                        >
                          {getActionIcon(tech.status)}
                        </IconButton>
                      </Tooltip>
                      
                      
                    </Box>
                  </Box>
                  
                  {/* Дополнительная информация */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                    <Typography variant="caption" color="text.secondary">
                      Категория: {tech.category || 'frontend'}
                    </Typography>
                    {tech.notes && (
                      <Typography variant="caption" color="text.secondary">
                        Заметки: {tech.notes.substring(0, 30)}...
                      </Typography>
                    )}
                  </Box>
                </Card>
              ))}
            </Box>
          ) : (
            <div className="empty-state">
              <p>Технологий пока нет. <Link to="/add">Добавьте первую!</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;