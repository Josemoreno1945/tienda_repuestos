import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    items,
    isCartOpen,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    setIsCartOpen,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} id="cart-overlay"></div>
      <div className="cart-panel" id="cart-panel">
        <div className="cart-header">
          <h2 className="cart-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            Carrito ({totalItems})
          </h2>
          <button
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            id="cart-close"
            aria-label="Cerrar carrito"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Tu carrito está vacío</p>
            <button className="btn-browse" onClick={() => { setIsCartOpen(false); navigate('/catalogo'); }}>
              Explorar Productos
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.id} id={`cart-item-${item.id}`}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">${item.price.toFixed(2)}</span>
                    <div className="cart-item-qty">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Reducir cantidad"
                      >−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Aumentar cantidad"
                      >+</button>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <span className="cart-item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
              </div>
              <button className="btn-checkout" onClick={handleCheckout} id="btn-go-checkout">
                Proceder al Pago
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
