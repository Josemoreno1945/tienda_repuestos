const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authorizeRole } = require('../middlewares/authMiddleware');

// GET /api/products - Listar productos con filtros opcionales
router.get('/', productController.getAll);

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', productController.getById);

// Rutas protegidas (Solo Admin)
router.post('/', authorizeRole('admin'), productController.create);
router.put('/:id', authorizeRole('admin'), productController.update);
router.delete('/:id', authorizeRole('admin'), productController.delete);

module.exports = router;
