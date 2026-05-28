import axios from 'axios';

const api = axios.create({
  // En producción usa la URL de Render. En local usa '/api'.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('motorepuestos_user');
  if (user) {
    const { role } = JSON.parse(user);
    if (role) {
      config.headers['x-user-role'] = role;
    }
  }
  return config;
});

export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  // Borrado lógico: cambia status a 'inactive'
  softDelete: (id) => api.patch(`/products/${id}/status`, { status: 'inactive' }),
  // Reactivar: cambia status a 'active'
  reactivate: (id) => api.patch(`/products/${id}/status`, { status: 'active' }),
};

export const authService = {
  login: (credentials) => api.post('/login', credentials),
};

export const checkoutService = {
  process: (data) => api.post('/checkout', data),
};

export default api;
