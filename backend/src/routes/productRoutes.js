const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authorizeRole } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/zodValidator');
const { productSchema, productPatchSchema } = require('../middlewares/schemas');

// GET /api/products - Listar productos con filtros opcionales
router.get('/', productController.getAll);

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', productController.getById);

// Rutas protegidas (Solo Admin)
router.post('/', authorizeRole('admin'), validate(productSchema), productController.create);
router.put('/:id', authorizeRole('admin'), validate(productSchema), productController.update);
router.patch('/:id/status', authorizeRole('admin'), validate(productPatchSchema), productController.patchStatus);
router.delete('/:id', authorizeRole('admin'), productController.delete);

module.exports = router;
