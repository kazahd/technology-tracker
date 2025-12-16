// src/components/SimpleAuth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function SimpleAuth({ redirectPath = "/settings" }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Пожалуйста, введите логин и пароль');
      return;
    }
    
    // Авторизуем пользователя
    login(username);
    
    // Перенаправляем на страницу настроек
    navigate(redirectPath);
  };

  const handleCancel = () => {
    // Возвращаемся на главную
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Требуется авторизация
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Для доступа к настройкам необходима авторизация
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Логин"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Введите любой логин"
            autoFocus
          />
          
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="Введите любой пароль"
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCancel}
            >
              Отмена
            </Button>
            
            <Button
              fullWidth
              variant="contained"
              type="submit"
            >
              Войти
            </Button>
          </Box>
        </form>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Это демо-авторизация. Любые данные будут приняты.
        </Typography>
      </Paper>
    </Box>
  );
}

export default SimpleAuth;