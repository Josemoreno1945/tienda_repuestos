import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const stockStatus =
    product.stock > 10
      ? { label: 'En Stock', className: 'stock-high' }
      : product.stock > 0
      ? { label: `Quedan ${product.stock}`, className: 'stock-low' }
      : { label: 'Agotado', className: 'stock-out' };

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      <div className="product-img-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop'; // Fallback
          }}
        />
        <span className={`stock-badge ${stockStatus.className}`}>
          {stockStatus.label}
        </span>
        <span className="category-tag">{product.category}</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <span className="product-compat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          {product.compatibility}
        </span>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          
          <button
            className="add-to-cart-btn"
            onClick={() => {
              if (!user) {
                navigate('/login');
              } else {
                addToCart(product);
              }
            }}
            disabled={product.stock === 0}
            id={`add-cart-${product.id}`}
          >
            {product.stock === 0 ? 'Agotado' : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Comprar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
