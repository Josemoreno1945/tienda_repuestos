export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-brand">
              <span className="brand-icon">🏍️</span>
              <span className="brand-text">Moto<span className="brand-accent">Repuestos</span></span>
            </div>
            <p className="footer-desc">
              Tu tienda de confianza para repuestos de motos. Calidad, variedad y los mejores precios del mercado.
            </p>
          </div>
          <div className="footer-col">
            <h4>Categorías</h4>
            <ul>
              <li><a href="/catalogo">Motor</a></li>
              <li><a href="/catalogo">Frenos</a></li>
              <li><a href="/catalogo">Transmisión</a></li>
              <li><a href="/catalogo">Accesorios</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Soporte</h4>
            <ul>
              <li><a href="#">Centro de Ayuda</a></li>
              <li><a href="#">Política de Devoluciones</a></li>
              <li><a href="#">Envíos</a></li>
              <li><a href="#">Garantía</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li>📧 info@motorepuestos.com</li>
              <li>📞 +58 412-123-4567</li>
              <li>📍 Caracas, Venezuela</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 MotoRepuestos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
