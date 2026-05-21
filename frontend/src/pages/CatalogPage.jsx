import ProductGrid from '../components/ProductGrid';

export default function CatalogPage({ products, activeCategory, onCategoryChange }) {
  return (
    <main className="catalog-page">
      <div className="catalog-header">
        <h1>Catálogo Completo</h1>
        <p>Encuentra el repuesto perfecto para tu moto</p>
      </div>
      <ProductGrid
        products={products}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
    </main>
  );
}
