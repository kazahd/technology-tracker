// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Перенаправляем на страницу авторизации
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;