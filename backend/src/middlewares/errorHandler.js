const { ZodError } = require('zod');

/**
 * Middleware centralizado de manejo de errores.
 * Captura errores de Zod, errores custom de negocio (stock, pasarela)
 * y devuelve un JSON estandarizado.
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error capturado:', err.message || err);

  // Errores de validación de Zod
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      type: 'VALIDATION_ERROR',
      message: 'Error de validación en los datos enviados',
      errors: fieldErrors,
    });
  }

  // Errores custom de stock insuficiente
  if (err.type === 'STOCK_ERROR') {
    return res.status(409).json({
      success: false,
      type: 'STOCK_ERROR',
      message: err.message,
      product: err.product || null,
    });
  }

  // Errores custom de pasarela de pago
  if (err.type === 'PAYMENT_ERROR') {
    return res.status(402).json({
      success: false,
      type: 'PAYMENT_ERROR',
      message: err.message,
    });
  }

  // Error genérico del servidor
  return res.status(err.status || 500).json({
    success: false,
    type: 'SERVER_ERROR',
    message: err.message || 'Error interno del servidor',
  });
};

module.exports = { errorHandler };
