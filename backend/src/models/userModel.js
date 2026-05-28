const { getDb } = require('../config/database');

const userModel = {
  /**
   * Buscar usuario por email
   */
  async findByEmail(email) {
    const db = await getDb();
    return await db.get('SELECT * FROM users WHERE email = ?', [email]);
  },

  /**
   * Obtener usuario por ID
   */
  async getById(id) {
    const db = await getDb();
    return await db.get('SELECT * FROM users WHERE id = ?', [id]);
  },
};

module.exports = userModel;
