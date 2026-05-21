import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/CheckoutForm';

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <button className="back-btn" onClick={() => navigate(-1)} id="btn-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m12 19-7-7 7-7M19 12H5"/>
          </svg>
          Volver
        </button>
        <h1>Finalizar Compra</h1>

        <div className="checkout-layout">
          {/* Resumen del carrito */}
          <div className="checkout-cart-summary" id="checkout-summary">
            <h3>Tu Pedido</h3>
            {items.length === 0 ? (
              <div className="empty-checkout">
                <p>No hay productos en el carrito</p>
                <button className="btn-browse" onClick={() => navigate('/catalogo')}>
                  Ir al Catálogo
                </button>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div className="checkout-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      <span className="checkout-item-qty">Cant: {item.quantity}</span>
                    </div>
                    <span className="checkout-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="checkout-subtotal">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Formulario */}
          <div className="checkout-form-wrapper">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </main>
  );
}
