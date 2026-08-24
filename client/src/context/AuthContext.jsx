// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario desde el token guardado al montar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Opcional: verificar token con el backend (ej. /auth/me)
      api
        .get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Registro
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error en el registro';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error en el login';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
      setError(null);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al enviar el correo';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Reset Password
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await api.put(`/auth/reset-password/${token}`, { password: newPassword });
      const { token: newToken, user } = response.data;
      localStorage.setItem('token', newToken);
      setUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al restablecer la contraseña';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  // Actualizar perfil (para futuros datos)
  const updateProfile = async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar perfil';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};