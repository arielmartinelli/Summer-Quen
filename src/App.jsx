import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Scissors, Printer, Shirt, Phone, Trash2, Plus, Minus, MessageCircle, Menu } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from './data/products';

const WHATSAPP_NUMBER = "5493516121498";

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQty, setDetailQty] = useState(1);

  const filteredProducts = activeCategory === 'Todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when modals/drawers are open
  useEffect(() => {
    if (isCartOpen || selectedProduct || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen, selectedProduct, mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setDetailQty(1);
  };

  const closeProductDetail = () => setSelectedProduct(null);

  const processAddToCart = (product, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQty } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const addOneToCart = (e, product) => {
    e.stopPropagation();
    processAddToCart(product, 1);
  };

  const addDetailToCart = () => {
    processAddToCart(selectedProduct, detailQty);
    closeProductDetail();
  };

  const updateCartItemQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = PRODUCTS.find(p => p.id === id);
        const newQty = Math.max(1, Math.min(item.quantity + delta, product.stock));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const formatPrice = (price) => `ARS ${price.toLocaleString('es-AR')}`;

  const sendWhatsAppOrder = () => {
    const message = `¡Hola Summer Quen! Me gustaría realizar este pedido del catálogo virtual:\n\n` +
      cart.map(item => `📦 ${item.name} (x${item.quantity}): ${formatPrice(item.price * item.quantity)}`).join('\n') +
      `\n\nTotal estimado: ${formatPrice(cartTotal)}\nQuedo a la espera de sus indicaciones.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div>
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-content">
          <div className="brand-logo">
            <img src="/logo.png" alt="Summer Quen Logo" className="navbar-logo" />
          </div>

          {/* Desktop links */}
          <div className="nav-links">
            <a href="#inicio">Inicio</a>
            <a href="#servicios">Servicios</a>
            <a href="#tienda">Tienda</a>
            <a href="#personalizar">Proyectos a Medida</a>
          </div>

          <div className="navbar-right">
            <div className="cart-icon-container" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={26} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            {/* Hamburger */}
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="#inicio" onClick={closeMobileMenu}>Inicio</a>
            <a href="#servicios" onClick={closeMobileMenu}>Servicios</a>
            <a href="#tienda" onClick={closeMobileMenu}>Tienda</a>
            <a href="#personalizar" onClick={closeMobileMenu}>Proyectos a Medida</a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="inicio" className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <h1 className="hero-title">Arte en cada <br /><span style={{ color: 'var(--accent-orange)' }}>costura.</span></h1>
            <p className="hero-subtitle">
              Descubre nuestra colección exclusiva de indumentaria artesanal y personaliza tus prendas con servicios de sublimación de alta calidad.
            </p>
            <div className="hero-actions">
              <a href="#tienda" className="btn btn-primary">Catálogo Completo</a>
              <a href="#personalizar" className="btn btn-outline light">Cotizar a Medida</a>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-image-bg"></div>
            <img src="/assets/hero.png" alt="Summer Quen Indumentaria" className="hero-image" />
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="section-padding">
        <div className="container">
          <div className="section-header">
            <h2>Taller y Servicios</h2>
            <div className="section-divider"></div>
          </div>
          <div className="services-grid">
            {[
              { icon: Scissors, name: "Costura a Medida", desc: "Arreglos, composturas y confección de indumentaria desde cero con moldería personalizada." },
              { icon: Printer, name: "Sublimación Premium", desc: "Estampado térmico sin relieve para uniformes, tazas, gorras y moda general." },
              { icon: Shirt, name: "Slow Fashion", desc: "Creación de cápsulas de ropa exclusiva con diseño propio y calidad de exportación." }
            ].map((s, idx) => (
              <div key={idx} className="service-card">
                <div className="service-icon-wrap"><s.icon size={32} /></div>
                <h3 className="service-title">{s.name}</h3>
                <p className="service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIENDA ── */}
      <section id="tienda" className="section-padding store-section">
        <div className="container">
          <div className="section-header">
            <h2>Indumentaria y Stock</h2>
            <p className="section-subtitle">Catálogo oficial de tienda</p>
          </div>
          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-pill${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="products-grid">
            {filteredProducts.map((p) => (
              <div key={p.id} className="product-card" onClick={() => openProductDetail(p)}>
                <div className="product-image-wrap">
                  <img src={p.img} alt={p.name} />
                  <span className="product-category-badge">{p.category}</span>
                  <button className="product-add-btn" onClick={(e) => addOneToCart(e, p)}>
                    <Plus size={20} />
                  </button>
                </div>
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <div className="price">{formatPrice(p.price)}</div>
                  <div className="stock-label">Stock: {p.stock} unid.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERSONALIZACIÓN ── */}
      <section id="personalizar" className="section-padding">
        <div className="personalization">
          <div className="pers-content">
            <h2 className="pers-title">¿Proyecto Personalizado?</h2>
            <p className="pers-desc">
              Ya sea que necesites uniformes con tu logo o la compostura de un traje. Llená los datos o escríbenos directamente.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const msg = `👋 Consulta Mayorista/Medida:\nNombre: ${formData.get('name')}\nRubro: ${formData.get('service')}\nInterés: ${formData.get('desc')}`;
              window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
            }}>
              <div className="pers-form-group">
                <input name="name" className="pers-input" placeholder="Nombre completo" required />
                <select name="service" className="pers-input" required>
                  <option value="">Elegí Servicio</option>
                  <option value="Taller de Costura">Taller Costura</option>
                  <option value="Sublimacion Comercial">Sublimación</option>
                </select>
              </div>
              <textarea name="desc" className="pers-input pers-textarea" placeholder="Describe brevemente tu proyecto..." rows={3} required></textarea>
              <button type="submit" className="btn btn-primary">Enviar Formulario</button>
            </form>
          </div>
          <div className="pers-image-wrap">
            <img src="/assets/sewing.png" alt="Costura a medida" className="pers-image" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="brand-logo" style={{ marginBottom: '1rem' }}>
              <img src="/logo.png" alt="Summer Quen Logo" className="footer-logo" />
            </div>
            <p className="footer-tagline">Elegancia, precisión y color para tu vestir diario o tus emprendimientos.</p>
          </div>
          <div className="footer-links">
            <h4 className="footer-link-title">Enlaces</h4>
            <a href="#inicio">Regresar Arriba</a>
            <a href="#tienda">Catálogo</a>
            <a href="#servicios">Taller</a>
          </div>
          <div className="footer-links">
            <h4 className="footer-link-title">Soporte Directo</h4>
            <span className="footer-contact"><Phone size={14} /> +54 9 351 612 1498</span>
            <span>Córdoba Capital, Argentina.</span>
          </div>
        </div>
        <div className="container footer-bottom">
          &copy; 2026 Summer Quen. Todos los derechos reservados.
        </div>
      </footer>

      {/* ── FLOATING WA ── */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="floating-wa">
        <MessageCircle size={28} />
      </a>

      {/* ── CART DRAWER ── */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3 className="cart-title">Carrito ({cartCount})</h3>
              <button className="icon-btn" onClick={() => setIsCartOpen(false)}><X size={22} /></button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag size={48} />
                  <p>Aún no cargaste nada al carrito.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.img} className="cart-item-img" alt={item.name} />
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-price">{formatPrice(item.price)}</div>
                      <div className="cart-item-controls">
                        <button onClick={() => updateCartItemQty(item.id, -1)}><Minus size={13} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartItemQty(item.id, 1)} disabled={item.quantity >= item.stock}><Plus size={13} /></button>
                      </div>
                    </div>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={17} /></button>
                  </div>
                ))
              )}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total estimado</span>
                <span style={{ color: 'var(--primary-green)' }}>{formatPrice(cartTotal)}</span>
              </div>
              <button disabled={cart.length === 0} onClick={sendWhatsAppOrder} className="btn btn-primary cart-checkout-btn">
                Hacer Pedido por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCT DETAIL MODAL ── */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeProductDetail}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProductDetail} aria-label="Cerrar"><X size={18} /></button>
            <div className="modal-body">
              <div className="modal-img-container">
                <img src={selectedProduct.img} alt={selectedProduct.name} />
              </div>
              <div className="modal-info">
                <div className="modal-category">{selectedProduct.category}</div>
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <div className="modal-price">{formatPrice(selectedProduct.price)}</div>
                <div className="modal-desc">{selectedProduct.description}</div>
                <div className={`modal-stock${selectedProduct.stock < 5 ? ' low' : ''}${selectedProduct.stock === 0 ? ' out' : ''}`}>
                  <span>Disponibilidad:</span>
                  <strong>
                    {selectedProduct.stock === 0 ? 'Sin stock' : `${selectedProduct.stock} unidades`}
                  </strong>
                </div>
                <div className="modal-controls">
                  <div className="qty-selector">
                    <button className="qty-btn" onClick={() => setDetailQty(Math.max(1, detailQty - 1))} disabled={detailQty <= 1}>
                      <Minus size={15} />
                    </button>
                    <input type="text" className="qty-input" value={detailQty} readOnly />
                    <button className="qty-btn" onClick={() => setDetailQty(Math.min(selectedProduct.stock, detailQty + 1))} disabled={detailQty >= selectedProduct.stock}>
                      <Plus size={15} />
                    </button>
                  </div>
                  <button className="btn btn-primary modal-add-btn" onClick={addDetailToCart} disabled={selectedProduct.stock === 0}>
                    <ShoppingBag size={18} /> Sumar al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
