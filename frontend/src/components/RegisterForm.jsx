import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    // Simulamos un ligero delay de red
    setTimeout(() => {
      const result = register({ name: formData.name, email: formData.email });
      setLoading(false);
      if (result.success) {
        navigate('/catalogo');
      }
    }, 800);
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <h2 className="auth-title">
          <span className="title-accent">🏍️</span> Únete a MotoRepuestos
        </h2>
        <p className="auth-subtitle">Crea tu cuenta para compras más rápidas</p>
        
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
            <label htmlFor="name">Nombre Completo</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" />
          </div>
          <div className="form-field">
            <label htmlFor="email">Correo Electrónico</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="tu@email.com" />
          </div>
          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary-auth" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Registrarse'}
          </button>
        </form>
        
        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
