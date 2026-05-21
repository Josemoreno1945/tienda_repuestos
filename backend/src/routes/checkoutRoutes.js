const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { validate } = require('../middlewares/zodValidator');
const { checkoutSchema } = require('../middlewares/schemas');

// POST /api/checkout - Procesar compra (con validación Zod)
router.post('/', validate(checkoutSchema), checkoutController.processCheckout);

module.exports = router;
