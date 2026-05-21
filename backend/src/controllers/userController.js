const userModel = require('../models/userModel');

const userController = {
  /**
   * POST /api/login
   * Simula autenticación básica
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({
          success: false,
          type: 'AUTH_ERROR',
          message: 'Credenciales inválidas',
        });
      }

      // Retornamos los datos del usuario sin la contraseña
      const { password: _, ...userData } = user;
      res.json({
        success: true,
        message: 'Login exitoso',
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
