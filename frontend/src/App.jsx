import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { productService } from './services/api';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminInventoryPage from './pages/AdminInventoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory) params.category = activeCategory;
      if (searchQuery) params.q = searchQuery;
      const res = await productService.getAll(params);
      setProducts(res.data.data || []);
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
    setActiveCategory('');
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar
              onSearch={handleSearch}
              onCategoryFilter={handleCategoryFilter}
            />
            <Cart />

            {loading ? (
              <div className="loading-screen" id="loading-screen">
                <div className="loader">
                  <span className="loader-icon">🏍️</span>
                  <span>Cargando repuestos...</span>
                </div>
              </div>
            ) : (
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage
                      products={products}
                      activeCategory={activeCategory}
                      onCategoryChange={handleCategoryFilter}
                    />
                  }
                />
                <Route
                  path="/catalogo"
                  element={
                    <CatalogPage
                      products={products}
                      activeCategory={activeCategory}
                      onCategoryChange={handleCategoryFilter}
                    />
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                {/* Ruta protegida para el inventario del Admin */}
                <Route 
                  path="/admin/inventory" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminInventoryPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            )}

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
