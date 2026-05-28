import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onSearch, onCategoryFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const categories = ['Todas', 'Motor', 'Frenos', 'Transmisión', 'Accesorios'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    navigate('/catalogo');
  };

  const handleCategory = (cat) => {
    if (onCategoryFilter) {
      onCategoryFilter(cat === 'Todas' ? '' : cat);
    }
    navigate('/catalogo');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" id="nav-logo">
          <span className="brand-icon">🏍️</span>
          <span className="brand-text">
            Moto<span className="brand-accent">Repuestos</span>
          </span>
        </Link>

        {/* Barra de búsqueda */}
        <form className="navbar-search" onSubmit={handleSearch} id="search-form">
          <input
            type="text"
            placeholder="Buscar repuestos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            id="search-input"
          />
          <button type="submit" className="search-btn" id="search-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        {/* Categorías Desktop */}
        <div className="navbar-categories" id="nav-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className="category-btn"
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Acciones */}
        <div className="navbar-actions">
          {user && user.role === 'admin' && (
            <Link to="/admin/inventory" className="btn-secondary-hero" style={{ padding: '0.4rem 0.8rem', marginRight: '0.5rem', fontSize: '0.85rem' }}>
              Inventario
            </Link>
          )}

          {user ? (
            <div className="user-menu-nav">
              <span className="user-greeting">Hola, {user.name.split(' ')[0]}</span>
              <button className="btn-logout" onClick={logout}>Salir</button>
            </div>
          ) : (
            <Link to="/login" className="btn-login-nav">Login</Link>
          )}

          <button
            className="cart-btn"
            onClick={toggleCart}
            id="cart-toggle-btn"
            aria-label="Abrir carrito"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {totalItems > 0 && (
              <span className="cart-badge" id="cart-badge">{totalItems}</span>
            )}
          </button>

          {/* Hamburger mobile */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Menú"
          >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" id="mobile-menu">
          <form onSubmit={handleSearch} className="mobile-search">
            <input
              type="text"
              placeholder="Buscar repuestos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Buscar</button>
          </form>
          <div className="mobile-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className="mobile-category-btn"
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
