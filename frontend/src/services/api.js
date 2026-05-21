import axios from 'axios';

const api = axios.create({
  // En producción usa la URL de Render. En local usa '/api'.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
};

export const authService = {
  login: (credentials) => api.post('/login', credentials),
};

export const checkoutService = {
  process: (data) => api.post('/checkout', data),
};

export default api;
