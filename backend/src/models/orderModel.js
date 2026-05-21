const axios = require('axios');
const JSON_SERVER = 'http://localhost:3001';

const orderModel = {
  /**
   * Crear una nueva orden
   */
  async create(orderData) {
    const order = {
      ...orderData,
      date: new Date().toISOString(),
    };
    const { data } = await axios.post(`${JSON_SERVER}/orders`, order);
    return data;
  },

  /**
   * Obtener todas las órdenes
   */
  async getAll() {
    const { data } = await axios.get(`${JSON_SERVER}/orders`);
    return data;
  },

  /**
   * Obtener órdenes por userId
   */
  async getByUserId(userId) {
    const { data } = await axios.get(`${JSON_SERVER}/orders?userId=${userId}`);
    return data;
  },
};

module.exports = orderModel;
