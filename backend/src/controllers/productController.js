const productModel = require('../models/productModel');

const productController = {
  /**
   * GET /api/products
   * Obtener todos los productos con filtros opcionales
   */
  async getAll(req, res, next) {
    try {
      const { category, q, compatibility, all } = req.query;
      const userRole = req.headers['x-user-role'];
      const includeInactive = (all === 'true' && userRole === 'admin');

      const products = await productModel.getAll({ category, q, compatibility, all: includeInactive });
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
      const newProduct = await productModel.create(req.body);
      res.status(201).json({ success: true, message: 'Producto creado', data: newProduct });
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
      const product = await productModel.getById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }
      const updatedProduct = await productModel.update(req.params.id, req.body);
      res.json({ success: true, message: 'Producto actualizado', data: updatedProduct });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/products/:id (Solo Admin)
   * Borrado lógico: marca el producto como 'inactive'
   */
  async delete(req, res, next) {
    try {
      const product = await productModel.getById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }
      await productModel.delete(req.params.id);
      res.json({ success: true, message: 'Producto desactivado correctamente' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/products/:id/status (Solo Admin)
   * Cambiar el estado del producto (reactivar o desactivar)
   */
  async patchStatus(req, res, next) {
    try {
      const product = await productModel.getById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }
      const { status } = req.body;
      const updatedProduct = await productModel.updateStatus(req.params.id, status);
      res.json({ success: true, message: `Producto ${status === 'active' ? 'reactivado' : 'desactivado'}`, data: updatedProduct });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
