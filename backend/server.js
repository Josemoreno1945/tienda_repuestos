const express = require('express');
const cors = require('cors');
const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');
const checkoutRoutes = require('./src/routes/checkoutRoutes');
const { errorHandler } = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares globales ─────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rutas ────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api', userRoutes);
app.use('/api/checkout', checkoutRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MotoRepuestos API funcionando 🏍️', timestamp: new Date().toISOString() });
});

// ── Middleware de manejo de errores (siempre al final) ───────────
app.use(errorHandler);

// ── Iniciar servidor ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏍️  MotoRepuestos API corriendo en http://localhost:${PORT}`);
  console.log(`📦  JSON Server debe estar corriendo en http://localhost:3001`);
  console.log(`\n📋  Endpoints disponibles:`);
  console.log(`   GET  /api/products          - Listar productos`);
  console.log(`   GET  /api/products/:id      - Obtener producto`);
  console.log(`   POST /api/login             - Autenticación`);
  console.log(`   POST /api/checkout          - Procesar compra`);
  console.log(`   GET  /api/health            - Estado del servidor\n`);
});
