import { useState, useEffect } from 'react';

export default function ProductCarousel({ products }) {
  const [current, setCurrent] = useState(0);
  const featured = products.slice(0, 4);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const goTo = (index) => setCurrent(index);
  const goPrev = () => setCurrent((prev) => (prev - 1 + featured.length) % featured.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % featured.length);

  return (
    <section className="carousel-section" id="product-carousel">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-accent">🔥</span> Productos Destacados
        </h2>
        <p className="section-subtitle">Los repuestos más vendidos de la semana</p>
      </div>
      <div className="carousel-wrapper">
        <button className="carousel-arrow carousel-prev" onClick={goPrev} aria-label="Anterior">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <div className="carousel-track">
          {featured.map((product, index) => (
            <div
              key={product.id}
              className={`carousel-slide ${index === current ? 'active' : ''}`}
            >
              <div className="carousel-card">
                <div className="carousel-img-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="carousel-img"
                    loading="lazy"
                  />
                  <div className="carousel-badge">{product.category}</div>
                </div>
                <div className="carousel-info">
                  <h3 className="carousel-product-name">{product.name}</h3>
                  <p className="carousel-product-desc">{product.description}</p>
                  <div className="carousel-product-meta">
                    <span className="carousel-price">${product.price.toFixed(2)}</span>
                    <span className="carousel-compat">{product.compatibility}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-arrow carousel-next" onClick={goNext} aria-label="Siguiente">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>

        <div className="carousel-dots">
          {featured.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === current ? 'active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
