import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/catalogo');
    } else {
      setError(result.error || 'Credenciales inválidas');
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <h2 className="auth-title">
          <span className="title-accent">🔐</span> Iniciar Sesión
        </h2>
        <p className="auth-subtitle">Accede a tu cuenta de MotoRepuestos</p>
        
        {error && (
          <div className="alert-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@email.com" 
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="btn-primary-auth" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Ingresar'}
          </button>
        </form>
        
        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate aquí</Link>
        </p>
        <div className="auth-demo-hint">
          <small>Credenciales de prueba: carlos@email.com / client123</small>
        </div>
      </div>
    </div>
  );
}
