const productModel = require('../models/productModel');

const productController = {
  /**
   * GET /api/products
   * Obtener todos los productos con filtros opcionales
   */
  async getAll(req, res, next) {
    try {
      const { category, q, compatibility } = req.query;
      const products = await productModel.getAll({ category, q, compatibility });
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id
   * Obtener un producto por ID
   */
  async getById(req, res, next) {
    try {
      const product = await productModel.getById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }
      res.json({ success: true, data: product });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }
      next(error);
    }
  },
  /**
   * POST /api/products (Solo Admin)
   * Crear un nuevo producto
   */
  async create(req, res, next) {
    try {
      const { data } = await axios.post(`${JSON_SERVER}/products`, req.body);
      res.status(201).json({ success: true, message: 'Producto creado', data });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/products/:id (Solo Admin)
   * Actualizar un producto
   */
  async update(req, res, next) {
    try {
      const { data } = await axios.put(`${JSON_SERVER}/products/${req.params.id}`, req.body);
      res.json({ success: true, message: 'Producto actualizado', data });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }
      next(error);
    }
  },

  /**
   * DELETE /api/products/:id (Solo Admin)
   * Eliminar un producto
   */
  async delete(req, res, next) {
    try {
      await axios.delete(`${JSON_SERVER}/products/${req.params.id}`);
      res.json({ success: true, message: 'Producto eliminado correctamente' });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }
      next(error);
    }
  },
};

module.exports = productController;
