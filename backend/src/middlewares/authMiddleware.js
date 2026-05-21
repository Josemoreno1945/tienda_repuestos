/**
 * Middleware para verificar si el usuario tiene el rol necesario.
 * @param {string} requiredRole - El rol requerido ('admin', 'client')
 */
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    // En una app real, aquí extraeríamos y decodificaríamos un JWT (Bearer token).
    // Para esta simulación, leemos un custom header que envía el frontend.
    const userRole = req.headers['x-user-role'];

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado. Se requiere autenticación.',
      });
    }

    if (userRole !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado (Forbidden). Permisos insuficientes.',
      });
    }

    next();
  };
};

module.exports = { authorizeRole };
