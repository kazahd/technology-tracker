// src/pages/Deadlines.jsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Tooltip
} from '@mui/material';
import {
  Event as EventIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import useTechnologies from '../hooks/useTechnologies';
import './Pages.css';

function Deadlines() {
  const {
    technologies,
    updateDeadline,
    updateDeadlinesBulk,
    getOverdueDeadlines,
    getUpcomingDeadlines
  } = useTechnologies();

  const [selectedTechIds, setSelectedTechIds] = useState([]);
  const [bulkDeadline, setBulkDeadline] = useState('');
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [editTechId, setEditTechId] = useState(null);
  const [editDeadline, setEditDeadline] = useState('');

  // Получаем данные о дедлайнах
  const overdueTechs = getOverdueDeadlines();
  const upcomingTechs = getUpcomingDeadlines(14);
  const techsWithDeadlines = technologies.filter(tech => tech.deadline);
  const techsWithoutDeadlines = technologies.filter(tech => !tech.deadline);

  // Форматирование даты для отображения
  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Не установлен';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Расчет дней до дедлайна
  const getDaysUntilDeadline = (dateString) => {
    if (!dateString) return null;
    const deadline = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Статус дедлайна
  const getDeadlineStatus = (tech) => {
    if (!tech.deadline) return 'no-deadline';
    
    const days = getDaysUntilDeadline(tech.deadline);
    
    if (tech.status === 'completed') return 'completed';
    if (days < 0) return 'overdue';
    if (days <= 3) return 'urgent';
    if (days <= 7) return 'warning';
    return 'normal';
  };

  // Цвет статуса
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'overdue': return 'error';
      case 'urgent': return 'error';
      case 'warning': return 'warning';
      case 'normal': return 'primary';
      default: return 'default';
    }
  };

  // Текст статуса
  const getStatusText = (tech) => {
    const status = getDeadlineStatus(tech);
    const days = getDaysUntilDeadline(tech.deadline);
    
    switch(status) {
      case 'completed': return '✅ Изучено';
      case 'overdue': return `⚠️ Просрочено на ${Math.abs(days)} дн.`;
      case 'urgent': return `⏰ Осталось ${days} дн.`;
      case 'warning': return `⚠️ Осталось ${days} дн.`;
      case 'normal': return `📅 Осталось ${days} дн.`;
      default: return '📅 Без дедлайна';
    }
  };

  // Валидация даты (не может быть в прошлом)
  const validateDate = (dateString) => {
    if (!dateString) return true; // пустая дата допустима
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
  };

  // Обработчик выбора технологии
  const handleSelectTech = (techId) => {
    setSelectedTechIds(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  // Обработчик выбора всех
  const handleSelectAll = () => {
    if (selectedTechIds.length === technologies.length) {
      setSelectedTechIds([]);
    } else {
      setSelectedTechIds(technologies.map(tech => tech.id));
    }
  };

  // Обработчик массового назначения дедлайна
  const handleBulkDeadlineSubmit = () => {
    if (selectedTechIds.length === 0) return;
    
    if (bulkDeadline && !validateDate(bulkDeadline)) {
      alert('Дедлайн не может быть в прошлом!');
      return;
    }
    
    updateDeadlinesBulk(selectedTechIds, bulkDeadline);
    setShowBulkDialog(false);
    setBulkDeadline('');
    setSelectedTechIds([]);
  };

  // Обработчик редактирования дедлайна
  const handleEditDeadline = (techId, currentDeadline) => {
    setEditTechId(techId);
    setEditDeadline(currentDeadline || '');
  };

  // Обработчик сохранения редактирования
  const handleSaveEdit = () => {
    if (!editTechId) return;
    
    if (editDeadline && !validateDate(editDeadline)) {
      alert('Дедлайн не может быть в прошлом!');
      return;
    }
    
    updateDeadline(editTechId, editDeadline);
    setEditTechId(null);
    setEditDeadline('');
  };

  // Обработчик удаления дедлайна
  const handleDeleteDeadline = (techId) => {
    if (window.confirm('Удалить дедлайн для этой технологии?')) {
      updateDeadline(techId, '');
    }
  };

  // Получить минимальную дату (сегодня) для input type="date"
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Установка сроков изучения
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Установите сроки изучения для каждой технологии. Дедлайны не могут быть в прошлом.
      </Typography>

      {/* Статистика */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6">{techsWithDeadlines.length}</Typography>
          <Typography variant="body2">С дедлайном</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6" color="error">{overdueTechs.length}</Typography>
          <Typography variant="body2">Просрочено</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6" color="warning.main">{upcomingTechs.length}</Typography>
          <Typography variant="body2">Ближайшие 2 недели</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6">{techsWithoutDeadlines.length}</Typography>
          <Typography variant="body2">Без дедлайна</Typography>
        </Paper>
      </Box>

      {/* Предупреждения */}
      {overdueTechs.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <WarningIcon sx={{ mr: 1 }} />
          У вас {overdueTechs.length} просроченных дедлайна!
        </Alert>
      )}

      {upcomingTechs.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AccessTimeIcon sx={{ mr: 1 }} />
          У вас {upcomingTechs.length} дедлайна в ближайшие 2 недели
        </Alert>
      )}

      {/* Панель массовых действий */}
      {selectedTechIds.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'action.selected' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography>
              Выбрано технологий: <strong>{selectedTechIds.length}</strong>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                onClick={() => setShowBulkDialog(true)}
              >
                Установить дедлайн
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  if (window.confirm(`Удалить дедлайны у ${selectedTechIds.length} технологий?`)) {
                    updateDeadlinesBulk(selectedTechIds, '');
                    setSelectedTechIds([]);
                  }
                }}
              >
                Удалить дедлайны
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSelectedTechIds([])}
              >
                Сбросить выбор
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Таблица технологий */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedTechIds.length === technologies.length}
                  indeterminate={
                    selectedTechIds.length > 0 && 
                    selectedTechIds.length < technologies.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell><strong>Технология</strong></TableCell>
              <TableCell><strong>Статус изучения</strong></TableCell>
              <TableCell><strong>Дедлайн изучения</strong></TableCell>
              <TableCell><strong>Статус дедлайна</strong></TableCell>
              <TableCell><strong>Действия</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {technologies.map((tech) => {
              const isSelected = selectedTechIds.includes(tech.id);
              const isEditing = editTechId === tech.id;
              const deadlineStatus = getDeadlineStatus(tech);

              return (
                <TableRow 
                  key={tech.id}
                  selected={isSelected}
                  sx={{
                    ...(deadlineStatus === 'overdue' && {
                      bgcolor: 'error.lighter',
                      '&:hover': { bgcolor: 'error.light' }
                    }),
                    ...(deadlineStatus === 'urgent' && {
                      bgcolor: 'warning.lighter',
                      '&:hover': { bgcolor: 'warning.light' }
                    })
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelectTech(tech.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">{tech.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tech.description.substring(0, 60)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tech.status === 'completed' ? '✅ Изучено' : 
                             tech.status === 'in-progress' ? '🔄 В процессе' : '⏳ Не начато'}
                      color={tech.status === 'completed' ? 'success' : 
                             tech.status === 'in-progress' ? 'warning' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          type="date"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          sx={{ width: 150 }}
                          inputProps={{ 
                            min: getTodayDate(),
                            style: { fontFamily: 'monospace' }
                          }}
                          error={editDeadline && !validateDate(editDeadline)}
                          helperText={editDeadline && !validateDate(editDeadline) ? 'Дата в прошлом' : ''}
                        />
                      </Box>
                    ) : (
                      <Typography>
                        {tech.deadline ? formatDateDisplay(tech.deadline) : 'Не установлен'}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(tech)}
                      color={getStatusColor(deadlineStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {isEditing ? (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={handleSaveEdit}
                            disabled={editDeadline && !validateDate(editDeadline)}
                          >
                            Сохранить
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setEditTechId(null);
                              setEditDeadline('');
                            }}
                          >
                            Отмена
                          </Button>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Изменить дедлайн">
                            <IconButton
                              size="small"
                              onClick={() => handleEditDeadline(tech.id, tech.deadline)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {tech.deadline && (
                            <Tooltip title="Удалить дедлайн">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteDeadline(tech.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Кнопки действий */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<CalendarIcon />}
          onClick={() => {
            setSelectedTechIds(techsWithoutDeadlines.map(tech => tech.id));
            setShowBulkDialog(true);
          }}
          disabled={techsWithoutDeadlines.length === 0}
        >
          Установить дедлайны для всех без срока
        </Button>
      </Box>

      {/* Диалог массового назначения дедлайна */}
      <Dialog open={showBulkDialog} onClose={() => setShowBulkDialog(false)}>
        <DialogTitle>
          Установить дедлайн для {selectedTechIds.length} технологий
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Выбранный дедлайн будет применен ко всем отмеченным технологиям.
          </Typography>
          <TextField
            type="date"
            label="Дата дедлайна"
            value={bulkDeadline}
            onChange={(e) => setBulkDeadline(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ 
              min: getTodayDate(),
              style: { fontFamily: 'monospace' }
            }}
            error={bulkDeadline && !validateDate(bulkDeadline)}
            helperText={bulkDeadline && !validateDate(bulkDeadline) ? 'Дедлайн не может быть в прошлом' : 'Оставьте пустым, чтобы удалить дедлайны'}
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            Используйте календарь браузера для выбора даты. Дедлайны не могут быть установлены на даты в прошлом.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBulkDialog(false)}>Отмена</Button>
          <Button 
            variant="contained" 
            onClick={handleBulkDeadlineSubmit}
            disabled={bulkDeadline && !validateDate(bulkDeadline)}
          >
            Установить дедлайн
          </Button>
        </DialogActions>
      </Dialog>

      {/* Подсказки */}
      <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
        <Typography variant="subtitle2" gutterBottom>
          💡 Подсказки:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Выберите технологии с помощью чекбоксов для массовых действий</li>
          <li>Нажмите на иконку карандаша для редактирования дедлайна</li>
          <li>Красным выделены просроченные дедлайны</li>
          <li>Желтым выделены срочные дедлайны (менее 3 дней)</li>
          <li>Зеленым отмечены изученные технологии</li>
          <li>Формат даты: ДД.ММ.ГГГГ (используется встроенный календарь браузера)</li>
          <li>Браузер автоматически предотвращает выбор дат в прошлом</li>
        </ul>
      </Paper>
    </Container>
  );
}

export default Deadlines;