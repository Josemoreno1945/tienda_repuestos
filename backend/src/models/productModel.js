const axios = require('axios');
const JSON_SERVER = 'http://localhost:3001';

const productModel = {
  /**
   * Obtener todos los productos, con filtros opcionales
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.q) params.append('q', filters.q);
    if (filters.compatibility) params.append('compatibility', filters.compatibility);

    const { data } = await axios.get(`${JSON_SERVER}/products?${params.toString()}`);
    return data;
  },

  /**
   * Obtener un producto por ID
   */
  async getById(id) {
    const { data } = await axios.get(`${JSON_SERVER}/products/${id}`);
    return data;
  },

  /**
   * Actualizar el stock de un producto
   */
  async updateStock(id, newStock) {
    const { data } = await axios.patch(`${JSON_SERVER}/products/${id}`, {
      stock: newStock,
    });
    return data;
  },
};

module.exports = productModel;
