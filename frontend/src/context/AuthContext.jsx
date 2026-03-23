import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkUserStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await api.get('/users/me/');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await api.post('/auth/token/', { username, password });
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    await checkUserStatus();
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register/', userData);
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
