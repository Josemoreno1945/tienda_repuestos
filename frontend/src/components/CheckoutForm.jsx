import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { checkoutService } from '../services/api';

export default function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formateo automático del número de tarjeta (solo dígitos)
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
    }
    // Formateo automático del CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }
    // Formateo automático de la fecha de expiración
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    }
    // Solo números en teléfono
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError(null);
  };

  // Validación en tiempo real del frontend
  const validateField = (name, value) => {
    switch (name) {
      case 'name': return value.length < 2 ? 'Mínimo 2 caracteres' : '';
      case 'email': return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email inválido' : '';
      case 'address': return value.length < 5 ? 'Mínimo 5 caracteres' : '';
      case 'city': return value.length < 2 ? 'Mínimo 2 caracteres' : '';
      case 'phone': return value.length < 7 ? 'Mínimo 7 dígitos' : '';
      case 'cardNumber': return value.length !== 16 ? 'Debe tener 16 dígitos' : '';
      case 'cardHolder': return value.length < 2 ? 'Nombre requerido' : '';
      case 'expiryDate': return !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value) ? 'Formato MM/YY' : '';
      case 'cvv': return !/^\d{3}$/.test(value) ? '3 dígitos' : '';
      default: return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setResult(null);

    // Validar todos los campos
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (items.length === 0) {
      setApiError('El carrito está vacío. Agrega productos antes de pagar.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
        },
        payment: {
          cardNumber: formData.cardNumber,
          cardHolder: formData.cardHolder,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
        },
        cart: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await checkoutService.process(payload);
      setResult(response.data);
      clearCart();
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        if (errorData.type === 'VALIDATION_ERROR' && errorData.errors) {
          // Mapear errores de Zod a los campos
          const fieldErrors = {};
          errorData.errors.forEach((e) => {
            const fieldName = e.field.split('.').pop();
            fieldErrors[fieldName] = e.message;
          });
          setErrors(fieldErrors);
          setApiError('Por favor corrige los campos marcados.');
        } else {
          setApiError(errorData.message || 'Error al procesar el pago');
        }
      } else {
        setApiError('Error de conexión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito
  if (result && result.success) {
    return (
      <div className="checkout-success" id="checkout-success">
        <div className="success-icon">✅</div>
        <h2>¡Compra Exitosa!</h2>
        <p>Tu orden ha sido procesada correctamente.</p>
        <div className="success-details">
          <div className="success-row">
            <span>N° de Orden:</span>
            <strong>#{result.data.orderId}</strong>
          </div>
          <div className="success-row">
            <span>Transacción:</span>
            <strong>{result.data.transactionId}</strong>
          </div>
          <div className="success-row">
            <span>Total Pagado:</span>
            <strong className="success-total">${result.data.total.toFixed(2)}</strong>
          </div>
        </div>
        <p className="success-note">Recibirás un email de confirmación con los detalles de envío.</p>
      </div>
    );
  }

  // Formulario de tarjeta formateado para display
  const displayCardNumber = formData.cardNumber
    ? formData.cardNumber.replace(/(.{4})/g, '$1 ').trim()
    : '';

  return (
    <form className="checkout-form" onSubmit={handleSubmit} id="checkout-form" noValidate>
      {/* Alerta de error del API */}
      {apiError && (
        <div className="alert-error" id="checkout-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
          </svg>
          {apiError}
        </div>
      )}

      {/* Datos de Envío */}
      <div className="form-section">
        <h3 className="form-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          Datos de Envío
        </h3>
        <div className="form-grid">
          <div className={`form-field ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="name">Nombre Completo</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} placeholder="Juan Pérez" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className={`form-field ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="juan@email.com" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className={`form-field full-width ${errors.address ? 'has-error' : ''}`}>
            <label htmlFor="address">Dirección</label>
            <input id="address" name="address" value={formData.address} onChange={handleChange} onBlur={handleBlur} placeholder="Av. Principal #123" />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
          <div className={`form-field ${errors.city ? 'has-error' : ''}`}>
            <label htmlFor="city">Ciudad</label>
            <input id="city" name="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} placeholder="Caracas" />
            {errors.city && <span className="field-error">{errors.city}</span>}
          </div>
          <div className={`form-field ${errors.phone ? 'has-error' : ''}`}>
            <label htmlFor="phone">Teléfono</label>
            <input id="phone" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} placeholder="04121234567" />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
        </div>
      </div>

      {/* Datos de Pago */}
      <div className="form-section">
        <h3 className="form-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><path d="M1 10h22"/>
          </svg>
          Datos de Pago
        </h3>

        {/* Preview de tarjeta */}
        <div className="card-preview" id="card-preview">
          <div className="card-chip"></div>
          <div className="card-number-preview">{displayCardNumber || '•••• •••• •••• ••••'}</div>
          <div className="card-preview-footer">
            <div>
              <span className="card-label">TITULAR</span>
              <span className="card-value">{formData.cardHolder || 'NOMBRE APELLIDO'}</span>
            </div>
            <div>
              <span className="card-label">VENCE</span>
              <span className="card-value">{formData.expiryDate || 'MM/YY'}</span>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className={`form-field full-width ${errors.cardNumber ? 'has-error' : ''}`}>
            <label htmlFor="cardNumber">Número de Tarjeta</label>
            <input id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleChange} onBlur={handleBlur} placeholder="1234567890123456" maxLength="16" />
            {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
          </div>
          <div className={`form-field full-width ${errors.cardHolder ? 'has-error' : ''}`}>
            <label htmlFor="cardHolder">Titular de la Tarjeta</label>
            <input id="cardHolder" name="cardHolder" value={formData.cardHolder} onChange={handleChange} onBlur={handleBlur} placeholder="JUAN PEREZ" />
            {errors.cardHolder && <span className="field-error">{errors.cardHolder}</span>}
          </div>
          <div className={`form-field ${errors.expiryDate ? 'has-error' : ''}`}>
            <label htmlFor="expiryDate">Fecha de Expiración</label>
            <input id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleChange} onBlur={handleBlur} placeholder="MM/YY" maxLength="5" />
            {errors.expiryDate && <span className="field-error">{errors.expiryDate}</span>}
          </div>
          <div className={`form-field ${errors.cvv ? 'has-error' : ''}`}>
            <label htmlFor="cvv">CVV</label>
            <input id="cvv" name="cvv" type="password" value={formData.cvv} onChange={handleChange} onBlur={handleBlur} placeholder="•••" maxLength="3" />
            {errors.cvv && <span className="field-error">{errors.cvv}</span>}
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="checkout-summary">
        <div className="summary-row">
          <span>Productos ({items.reduce((s, i) => s + i.quantity, 0)})</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Envío</span>
          <span className={totalPrice >= 100 ? 'free-shipping' : ''}>
            {totalPrice >= 100 ? 'GRATIS' : '$5.99'}
          </span>
        </div>
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>${(totalPrice >= 100 ? totalPrice : totalPrice + 5.99).toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        className="btn-pay"
        disabled={loading || items.length === 0}
        id="btn-pay"
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Procesando pago...
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Pagar ${(totalPrice >= 100 ? totalPrice : totalPrice + 5.99).toFixed(2)}
          </>
        )}
      </button>

      <p className="secure-note">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Pago seguro y encriptado. Tarjetas terminadas en 0000 serán rechazadas (simulación).
      </p>
    </form>
  );
}
