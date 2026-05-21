const axios = require('axios');
const JSON_SERVER = 'http://localhost:3001';

const userModel = {
  /**
   * Buscar usuario por email
   */
  async findByEmail(email) {
    const { data } = await axios.get(`${JSON_SERVER}/users?email=${email}`);
    return data.length > 0 ? data[0] : null;
  },

  /**
   * Obtener usuario por ID
   */
  async getById(id) {
    const { data } = await axios.get(`${JSON_SERVER}/users/${id}`);
    return data;
  },
};

module.exports = userModel;
