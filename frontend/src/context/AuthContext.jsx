import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('motorepuestos_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem('motorepuestos_user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error de conexión. Intenta nuevamente.' 
      };
    }
  };

  const register = (userData) => {
    // Simulación de registro en el frontend
    // En un caso real, esto enviaría un POST a /api/users
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'client'
    };
    setUser(newUser);
    localStorage.setItem('motorepuestos_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('motorepuestos_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
