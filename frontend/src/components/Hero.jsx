import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero" id="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}></div>
        ))}
      </div>
      <div className="hero-content">
        <div className="hero-badge">🔧 Envío gratis en compras +$100</div>
        <h1 className="hero-title">
          Los Mejores Repuestos<br />
          <span className="hero-highlight">Para Tu Moto</span>
        </h1>
        <p className="hero-subtitle">
          Más de 500 repuestos originales y genéricos para las principales marcas.
          Honda, Yamaha, Bajaj, Suzuki y más. Calidad garantizada al mejor precio.
        </p>
        <div className="hero-actions">
          <button
            className="btn-primary-hero"
            onClick={() => navigate('/catalogo')}
            id="hero-cta"
          >
            Ver Catálogo
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
          <button
            className="btn-secondary-hero"
            onClick={() => navigate('/catalogo')}
            id="hero-secondary-cta"
          >
            Ofertas del Día
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Repuestos</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Marcas</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">24h</span>
            <span className="stat-label">Envío Rápido</span>
          </div>
        </div>
      </div>
    </section>
  );
}
