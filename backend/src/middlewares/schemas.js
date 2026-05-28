const { z } = require('zod');

// Esquema de validación para el checkout
const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Debe ser un email válido'),
    address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    phone: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  }),
  payment: z.object({
    cardNumber: z
      .string()
      .regex(/^\d{16}$/, 'El número de tarjeta debe tener exactamente 16 dígitos'),
    cardHolder: z.string().min(2, 'El nombre del titular es requerido'),
    expiryDate: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato de fecha inválido (MM/YY)'),
    cvv: z
      .string()
      .regex(/^\d{3}$/, 'El CVV debe ser numérico de 3 dígitos'),
  }),
  cart: z
    .array(
      z.object({
        productId: z.number().int().positive('ID de producto inválido'),
        quantity: z.number().int().min(1, 'La cantidad mínima es 1'),
      })
    )
    .min(1, 'El carrito no puede estar vacío'),
});

// Esquema de validación para login
const loginSchema = z.object({
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Esquema de validación para productos
const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser un número positivo'),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  image: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  category: z.string().min(2, 'La categoría es requerida'),
  compatibility: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Esquema parcial para actualizaciones PATCH (reactivar/desactivar)
const productPatchSchema = z.object({
  status: z.enum(['active', 'inactive']),
});

module.exports = { checkoutSchema, loginSchema, productSchema, productPatchSchema };
