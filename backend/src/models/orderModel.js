const { getDb } = require('../config/database');

const orderModel = {
  /**
   * Crear una nueva orden
   */
  async create(orderData) {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO orders (userId, customerName, customerEmail, shippingAddress, phone, products, total, status, transactionId, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        orderData.userId,
        orderData.customerName,
        orderData.customerEmail,
        orderData.shippingAddress,
        orderData.phone,
        JSON.stringify(orderData.products),
        orderData.total,
        orderData.status,
        orderData.transactionId,
        new Date().toISOString()
      ]
    );
    return { id: result.lastID, ...orderData };
  },

  /**
   * Obtener todas las órdenes
   */
  async getAll() {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM orders');
    return rows.map(row => ({ ...row, products: JSON.parse(row.products) }));
  },

  /**
   * Obtener órdenes por userId
   */
  async getByUserId(userId) {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM orders WHERE userId = ?', [userId]);
    return rows.map(row => ({ ...row, products: JSON.parse(row.products) }));
  },
};

module.exports = orderModel;
