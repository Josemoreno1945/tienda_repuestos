/**
 * Middleware genérico de validación con Zod.
 * Recibe un esquema Zod y valida req.body contra él.
 * Si falla, lanza el error para que lo capture el errorHandler.
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      // Pasamos el error al manejador centralizado
      next(error);
    }
  };
};

module.exports = { validate };
