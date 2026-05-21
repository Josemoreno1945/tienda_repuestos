const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate } = require('../middlewares/zodValidator');
const { loginSchema } = require('../middlewares/schemas');

// POST /api/login - Autenticación simulada
router.post('/login', validate(loginSchema), userController.login);

module.exports = router;
