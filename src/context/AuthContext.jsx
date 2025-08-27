import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear contexto
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// Proveedor del contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // info del usuario
  const [token, setToken] = useState(null);     // jwt token
  const [loading, setLoading] = useState(true); // carga inicial

  // Cargar token y usuario desde localStorage al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // Obtener info usuario con token
      fetchUserProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Función para obtener perfil usuario
  const fetchUserProfile = async (jwt) => {
    try {
      const res = await axios.get('http://localhost:8080/api/user/profile', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });
      const jwt = res.data.jwtToken;
      localStorage.setItem('token', jwt);
      setToken(jwt);
      await fetchUserProfile(jwt);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
