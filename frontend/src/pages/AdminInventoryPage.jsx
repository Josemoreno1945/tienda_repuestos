import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import ProductFormModal from '../components/ProductFormModal';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'outOfStock' | 'inactive'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Pedimos todos los productos (activos e inactivos)
      const res = await productService.getAll({ all: true });
      setProducts(res.data.data || []);
    } catch (err) {
      console.error('Error cargando inventario:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Filtros para las 3 listas ──────────────────────────────────
  const activeProducts = products.filter(p => p.status === 'active' && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.status === 'active' && p.stock === 0);
  const inactiveProducts = products.filter(p => p.status === 'inactive');

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'active': return activeProducts;
      case 'outOfStock': return outOfStockProducts;
      case 'inactive': return inactiveProducts;
      default: return activeProducts;
    }
  };

  const filteredProducts = getFilteredProducts();

  // ── Handlers de Modal ──────────────────────────────────────────
  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, productData);
      } else {
        await productService.create(productData);
      }
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error('Error guardando producto:', err);
      alert('Error guardando producto');
    }
  };

  // ── Borrado Lógico (soft delete) ───────────────────────────────
  const handleSoftDelete = async (id) => {
    if (!window.confirm('¿Desactivar este producto? Se moverá a "Productos Inactivos".')) return;
    try {
      await productService.softDelete(id);
      fetchProducts();
    } catch (err) {
      console.error('Error desactivando producto:', err);
      alert('Error al desactivar el producto');
    }
  };

  // ── Reactivar producto ─────────────────────────────────────────
  const handleReactivate = async (id) => {
    try {
      await productService.reactivate(id);
      fetchProducts();
    } catch (err) {
      console.error('Error reactivando producto:', err);
      alert('Error al reactivar el producto');
    }
  };

  // ── Actualizar stock (+/-) ─────────────────────────────────────
  const handleUpdateStock = async (product, change) => {
    const newStock = product.stock + change;
    if (newStock < 0) return; // Evita stock negativo en frontend
    
    const updatedProduct = { ...product, stock: newStock };
    
    try {
      await productService.update(product.id, updatedProduct);
      // Actualización optimística para mayor fluidez
      setProducts(products.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
    } catch (err) {
      console.error('Error actualizando stock:', err);
      alert('Error actualizando stock');
      fetchProducts(); // revertir si hay error
    }
  };

  // ── Tabs Config ────────────────────────────────────────────────
  const tabs = [
    { key: 'active',     label: 'Inventario Activo', count: activeProducts.length,     icon: '📦', color: '#00FF7F' },
    { key: 'outOfStock', label: 'Fuera de Stock',    count: outOfStockProducts.length, icon: '⚠️', color: '#f59e0b' },
    { key: 'inactive',   label: 'Inactivos',         count: inactiveProducts.length,   icon: '🚫', color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <span className="loader-icon">⏳</span>
          <span>Cargando Inventario...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div style={headerSectionStyle}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Gestión de Inventario</h1>
          <p style={{ color: '#A0A0A0' }}>Administra los productos, precios y stock de la tienda.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary-hero" style={{ padding: '0.8rem 1.5rem' }}>
          + Nuevo Producto
        </button>
      </div>

      {/* ── Resumen rápido ──────────────────────────────────── */}
      <div style={summaryGridStyle}>
        <div style={{ ...summaryCardStyle, borderLeft: '4px solid #00FF7F' }}>
          <span style={{ fontSize: '2rem', fontWeight: '800' }}>{activeProducts.length}</span>
          <span style={{ color: '#A0A0A0', fontSize: '0.85rem' }}>Activos con stock</span>
        </div>
        <div style={{ ...summaryCardStyle, borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '2rem', fontWeight: '800' }}>{outOfStockProducts.length}</span>
          <span style={{ color: '#A0A0A0', fontSize: '0.85rem' }}>Agotados</span>
        </div>
        <div style={{ ...summaryCardStyle, borderLeft: '4px solid #ef4444' }}>
          <span style={{ fontSize: '2rem', fontWeight: '800' }}>{inactiveProducts.length}</span>
          <span style={{ color: '#A0A0A0', fontSize: '0.85rem' }}>Inactivos</span>
        </div>
        <div style={{ ...summaryCardStyle, borderLeft: '4px solid #8b5cf6' }}>
          <span style={{ fontSize: '2rem', fontWeight: '800' }}>{products.length}</span>
          <span style={{ color: '#A0A0A0', fontSize: '0.85rem' }}>Total productos</span>
        </div>
      </div>

      {/* ── Pestañas / Tabs ─────────────────────────────────── */}
      <div style={tabsStyle}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            style={activeTab === tab.key ? { ...tabBtnStyle, color: tab.color, borderBottom: `2px solid ${tab.color}` } : tabBtnStyle}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span style={{ ...tabCountStyle, background: activeTab === tab.key ? tab.color + '30' : 'rgba(255,255,255,0.06)', color: activeTab === tab.key ? tab.color : '#A0A0A0' }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Tabla de productos ──────────────────────────────── */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={thRowStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Producto</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={emptyStyle}>
                  {activeTab === 'active' && '📦 Todos los productos activos aparecerán aquí.'}
                  {activeTab === 'outOfStock' && '⚠️ Los productos sin stock aparecerán aquí automáticamente.'}
                  {activeTab === 'inactive' && '🚫 Los productos desactivados aparecerán aquí.'}
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} style={trStyle}>
                  <td style={tdStyle}>{product.id}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={product.image} alt={product.name} style={imgStyle} />
                      <span style={{ fontWeight: '500' }}>{product.name}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>${product.price.toFixed(2)}</td>

                  {/* ── Columna de Stock ── */}
                  <td style={tdStyle}>
                    {activeTab === 'inactive' ? (
                      // Lista 3: Solo muestra el stock, sin botones
                      <span style={{ ...stockBadgeStyle, background: 'rgba(107,114,128,0.2)', color: '#9ca3af' }}>
                        {product.stock} un.
                      </span>
                    ) : (
                      // Listas 1 y 2: Botones +/-
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleUpdateStock(product, -1)} 
                          style={{
                            ...stockBtnStyle,
                            opacity: product.stock <= 0 ? 0.3 : 1,
                            cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                          }}
                          disabled={product.stock <= 0}
                          title={product.stock <= 0 ? 'Stock en 0, no se puede restar' : 'Restar 1 unidad'}
                        >−</button>
                        <span style={{ 
                          ...stockBadgeStyle, 
                          background: product.stock > 10 ? 'rgba(16,185,129,0.2)' : product.stock > 0 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)', 
                          color: product.stock > 10 ? '#00FF7F' : product.stock > 0 ? '#f59e0b' : '#ef4444' 
                        }}>
                          {product.stock === 0 ? 'Agotado' : `${product.stock} un.`}
                        </span>
                        <button 
                          onClick={() => handleUpdateStock(product, 1)} 
                          style={stockBtnStyle}
                          title="Sumar 1 unidad"
                        >+</button>
                      </div>
                    )}
                  </td>

                  <td style={tdStyle}>{product.category}</td>

                  {/* ── Columna de Estado ── */}
                  <td style={tdStyle}>
                    {activeTab === 'active' && (
                      <span style={{ ...statusBadgeStyle, background: 'rgba(16,185,129,0.2)', color: '#00FF7F' }}>
                        Activo
                      </span>
                    )}
                    {activeTab === 'outOfStock' && (
                      <span style={{ ...statusBadgeStyle, background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                        Agotado
                      </span>
                    )}
                    {activeTab === 'inactive' && (
                      <span style={{ ...statusBadgeStyle, background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                        Inactivo
                      </span>
                    )}
                  </td>

                  {/* ── Columna de Acciones ── */}
                  <td style={tdStyle}>
                    {activeTab === 'inactive' ? (
                      // Lista 3: Solo botón "Reactivar"
                      <button 
                        onClick={() => handleReactivate(product.id)} 
                        style={{ ...actionBtnStyle, background: 'rgba(16,185,129,0.15)', color: '#00FF7F', borderColor: 'rgba(16,185,129,0.3)' }}
                      >
                        ↩ Reactivar
                      </button>
                    ) : (
                      // Listas 1 y 2: Editar y Eliminar (soft delete)
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenModal(product)} style={actionBtnStyle}>Editar</button>
                        <button 
                          onClick={() => handleSoftDelete(product.id)} 
                          style={{ ...actionBtnStyle, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSaveProduct} 
        initialData={editingProduct} 
      />
    </div>
  );
}

// ── Inline Styles (dark theme) ───────────────────────────────────
const pageStyle = { padding: '8rem 2rem 4rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh' };
const headerSectionStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' };

const summaryGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' };
const summaryCardStyle = { background: '#1e1e1e', borderRadius: '10px', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', border: '1px solid rgba(255,255,255,0.06)' };

const tabsStyle = { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0' };
const tabBtnStyle = { padding: '0.75rem 1rem', background: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: '0.3s', color: '#A0A0A0', display: 'flex', alignItems: 'center', gap: '0.5rem' };
const tabCountStyle = { padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: '700', borderRadius: '50px' };

const tableContainerStyle = { background: '#1e1e1e', borderRadius: '12px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.06)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const thRowStyle = { background: '#2a2a2a' };
const thStyle = { padding: '1rem', color: '#A0A0A0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' };
const trStyle = { borderBottom: '1px solid rgba(255,255,255,0.06)' };
const tdStyle = { padding: '1rem', verticalAlign: 'middle' };
const imgStyle = { width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' };
const emptyStyle = { textAlign: 'center', padding: '3rem', color: '#737373', fontSize: '0.95rem' };

const stockBadgeStyle = { padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: '700', borderRadius: '50px', display: 'inline-block', minWidth: '60px', textAlign: 'center' };
const statusBadgeStyle = { padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: '700', borderRadius: '50px' };
const actionBtnStyle = { background: '#2a2a2a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' };
const stockBtnStyle = { background: '#333', color: '#fff', border: 'none', borderRadius: '4px', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', transition: 'opacity 0.2s' };
