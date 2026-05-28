const { getDb } = require('../config/database');

const productModel = {
  /**
   * Obtener todos los productos, con filtros opcionales
   */
  async getAll(filters = {}) {
    const db = await getDb();
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Por defecto, solo traer productos activos
    if (filters.all !== 'true' && filters.all !== true) {
      query += " AND status = 'active'";
    }

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters.q) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.q}%`);
    }
    if (filters.compatibility) {
      query += ' AND compatibility = ?';
      params.push(filters.compatibility);
    }

    return await db.all(query, params);
  },

  /**
   * Obtener un producto por ID
   */
  async getById(id) {
    const db = await getDb();
    return await db.get('SELECT * FROM products WHERE id = ?', [id]);
  },

  /**
   * Crear producto
   */
  async create(data) {
    const db = await getDb();
    const status = data.status || 'active';
    const result = await db.run(
      'INSERT INTO products (name, description, price, stock, image, category, compatibility, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.name, data.description, data.price, data.stock, data.image, data.category, data.compatibility, status]
    );
    return { id: result.lastID, ...data, status };
  },

  /**
   * Actualizar producto completo
   */
  async update(id, data) {
    const db = await getDb();
    const status = data.status || 'active';
    await db.run(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ?, category = ?, compatibility = ?, status = ? WHERE id = ?',
      [data.name, data.description, data.price, data.stock, data.image, data.category, data.compatibility, status, id]
    );
    return { id, ...data, status };
  },

  /**
   * Actualizar el stock de un producto
   */
  async updateStock(id, newStock) {
    const db = await getDb();
    await db.run('UPDATE products SET stock = ? WHERE id = ?', [newStock, id]);
    return await this.getById(id);
  },

  /**
   * Eliminar producto (Soft Delete)
   */
  async delete(id) {
    const db = await getDb();
    // Soft Delete: En lugar de borrar físicamente, cambiamos el estado a 'inactive'
    await db.run("UPDATE products SET status = 'inactive' WHERE id = ?", [id]);
    return { success: true, message: 'Producto marcado como inactivo' };
  },

  /**
   * Actualizar solo el estado de un producto (reactivar/desactivar)
   */
  async updateStatus(id, status) {
    const db = await getDb();
    await db.run('UPDATE products SET status = ? WHERE id = ?', [status, id]);
    return await this.getById(id);
  }
};

module.exports = productModel;
