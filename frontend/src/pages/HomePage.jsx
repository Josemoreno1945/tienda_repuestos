import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import ProductGrid from '../components/ProductGrid';

export default function HomePage({ products, activeCategory, onCategoryChange }) {
  return (
    <main>
      <Hero />
      <ProductCarousel products={products} />
      <ProductGrid
        products={products}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
    </main>
  );
}
