const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel');

/**
 * Simula el procesamiento de la pasarela de pago.
 * Delay de 2 segundos. Rechaza tarjetas que terminan en "0000".
 */
function simulatePaymentGateway(cardNumber) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular tarjeta rechazada si termina en 0000
      if (cardNumber.endsWith('0000')) {
        const error = new Error('Tarjeta rechazada por la entidad bancaria');
        error.type = 'PAYMENT_ERROR';
        reject(error);
      } else {
        resolve({ transactionId: 'TXN-' + Date.now(), status: 'approved' });
      }
    }, 2000);
  });
}

const checkoutController = {
  /**
   * POST /api/checkout
   * Procesa una orden completa: valida stock -> pago -> descuenta stock -> crea orden
   */
  async processCheckout(req, res, next) {
    try {
      const { customer, payment, cart } = req.body;

      // 1. Verificar stock de todos los productos del carrito
      let total = 0;
      const productDetails = [];

      for (const item of cart) {
        const product = await productModel.getById(item.productId);

        if (!product) {
          const error = new Error(`Producto con ID ${item.productId} no encontrado`);
          error.type = 'STOCK_ERROR';
          error.product = { id: item.productId };
          throw error;
        }

        if (product.stock < item.quantity) {
          const error = new Error(
            `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}`
          );
          error.type = 'STOCK_ERROR';
          error.product = {
            id: product.id,
            name: product.name,
            availableStock: product.stock,
            requested: item.quantity,
          };
          throw error;
        }

        total += product.price * item.quantity;
        productDetails.push({ ...product, requestedQty: item.quantity });
      }

      // 2. Simular pasarela de pago (delay de 2 segundos)
      const paymentResult = await simulatePaymentGateway(payment.cardNumber);

      // 3. Descontar stock de cada producto
      for (const product of productDetails) {
        const newStock = product.stock - product.requestedQty;
        await productModel.updateStock(product.id, newStock);
      }

      // 4. Crear la orden
      const order = await orderModel.create({
        userId: null, // Compra como invitado
        customerName: customer.name,
        customerEmail: customer.email,
        shippingAddress: `${customer.address}, ${customer.city}`,
        phone: customer.phone,
        products: cart,
        total: Math.round(total * 100) / 100,
        status: 'pagado',
        transactionId: paymentResult.transactionId,
      });

      // 5. Respuesta exitosa
      res.status(200).json({
        success: true,
        message: '¡Compra realizada con éxito!',
        data: {
          orderId: order.id,
          transactionId: paymentResult.transactionId,
          total: Math.round(total * 100) / 100,
          status: 'pagado',
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = checkoutController;
