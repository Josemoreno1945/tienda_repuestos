import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, activeCategory, onCategoryChange }) {
  const [modelFilter, setModelFilter] = useState('');

  const categories = ['Todas', 'Motor', 'Frenos', 'Transmisión', 'Accesorios'];

  // Extraer modelos únicos de los productos
  const models = useMemo(() => {
    const uniqueModels = [...new Set(products.map((p) => p.compatibility))];
    return ['Todos', ...uniqueModels.sort()];
  }, [products]);

  // Filtrar productos
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const catMatch = !activeCategory || activeCategory === '' || p.category === activeCategory;
      const modelMatch = !modelFilter || modelFilter === '' || p.compatibility === modelFilter;
      return catMatch && modelMatch;
    });
  }, [products, activeCategory, modelFilter]);

  return (
    <section className="product-grid-section" id="product-grid">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-accent">📦</span> Catálogo de Repuestos
        </h2>
        <p className="section-subtitle">
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filtros */}
      <div className="filters-bar" id="filters-bar">
        <div className="filter-group">
          <label className="filter-label">Categoría</label>
          <div className="filter-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${
                  (cat === 'Todas' && !activeCategory) || cat === activeCategory
                    ? 'active'
                    : ''
                }`}
                onClick={() => onCategoryChange(cat === 'Todas' ? '' : cat)}
                id={`filter-cat-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label className="filter-label">Modelo de Moto</label>
          <select
            className="filter-select"
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            id="filter-model"
          >
            {models.map((model) => (
              <option key={model} value={model === 'Todos' ? '' : model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grilla */}
      <div className="products-grid">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="no-results" id="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>No se encontraron productos</h3>
            <p>Intenta con otros filtros o busca algo diferente</p>
          </div>
        )}
      </div>
    </section>
  );
}
