import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Scissors, Printer, Shirt, Phone, Crown, Trash2, Plus, Minus, MessageCircle, ArrowLeft } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from './data/products';

const WHATSAPP_NUMBER = "5493516121498";

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Category Filtering
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Detalle Modal State
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

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setDetailQty(1); // Reset qty each time
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  // Generic Cart Update
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

  // Called from Store Cards directly (adds 1)
  const addOneToCart = (e, product) => {
    e.stopPropagation(); // Prevent opening modal
    processAddToCart(product, 1);
  };

  // Called from Detail Modal (adds selected quantity)
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

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

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
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-content">
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'1.5rem', fontWeight:700, color: 'var(--primary-green)' }}>
            <Crown color="var(--accent-orange)" />
            <span className="font-heading">SUMMER <span style={{ color: 'var(--accent-orange)' }}>QUEN</span></span>
          </div>
          <div className="nav-links">
            <a href="#inicio">Inicio</a>
            <a href="#servicios">Servicios</a>
            <a href="#tienda">Tienda</a>
            <a href="#personalizar">Proyectos a Medida</a>
          </div>
          <div className="cart-icon-container" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={28} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>
        </div>
      </nav>

      <section id="inicio" className="hero">
        <div className="container hero-grid">
          <div>
            <h1 className="hero-title">Arte en cada <br/><span style={{ color: 'var(--accent-orange)' }}>costura.</span></h1>
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

      <section id="servicios" className="section-padding">
        <div className="container">
          <div className="products-header text-center" style={{ display:'block', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Taller y Servicios</h2>
            <div style={{ width:'80px', height:'4px', background:'var(--accent-orange)', margin:'0 auto' }}></div>
          </div>
          <div className="services-grid">
            {[
              { icon: Scissors, name: "Costura a Medida", desc: "Arreglos, composturas y confección de indumentaria desde cero con moldería personalizada." },
              { icon: Printer, name: "Sublimación Premium", desc: "Estampado térmico sin relieve para uniformes, tazas, gorras y moda general." },
              { icon: Shirt, name: "Slow Fashion", desc: "Creación de cápsulas de ropa exclusiva con diseño propio y calidad de exportación." }
            ].map((s, idx) => (
              <div key={idx} className="service-card">
                <div className="service-icon-wrap"><s.icon size={32} /></div>
                <h3 style={{ fontSize:'1.25rem', marginBottom:'1rem' }}>{s.name}</h3>
                <p style={{ color:'var(--text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tienda" className="section-padding" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="products-header">
            <div>
              <h2 style={{ fontSize:'2.5rem' }}>Indumentaria y Stock</h2>
              <p style={{ color:'var(--text-muted)' }}>Catálogo oficial de tienda</p>
            </div>
          </div>
          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
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
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop:'0.25rem' }}>Stock: {p.stock} unid.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="personalizar" className="section-padding">
        <div className="personalization">
          <div>
            <h2 style={{ fontSize:'3rem', marginBottom:'1.5rem', color: 'var(--white)' }}>¿Proyecto Personalizado?</h2>
            <p style={{ fontSize:'1.125rem', opacity:0.8, marginBottom:'2rem' }}>
              Ya sea que necesites uniformes corporativos con tu logo (sublimación) o la compostura de un traje a la medida. Llena los datos rápidos o escríbenos directamente.
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
                  <option value="" style={{ color: 'black' }}>Elegí Servicio</option>
                  <option value="Taller de Costura" style={{ color: 'black' }}>Taller Costura</option>
                  <option value="Sublimacion Comercial" style={{ color: 'black' }}>Sublimación</option>
                </select>
              </div>
              <textarea name="desc" className="pers-input" placeholder="Describe brevemente tus prendas/proyecto..." rows={3} style={{ width:'100%', marginBottom:'1.5rem' }} required></textarea>
              <div style={{ display:'flex', gap:'1rem' }}>
                <button type="submit" className="btn btn-primary">Enviar Formulario</button>
              </div>
            </form>
          </div>
          <div style={{ padding: '0 2rem' }}>
             <img src="/assets/sewing.png" alt="Costura" style={{ borderRadius:'2rem', boxShadow:'0 20px 40px rgba(0,0,0,0.5)', width:'100%', height:'400px', objectFit:'cover' }} />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'1.5rem', fontWeight:700, marginBottom:'1.5rem'}}>
              <Crown color="var(--accent-orange)" />
              <span className="font-heading">SUMMER <span style={{ color: 'var(--accent-orange)' }}>QUEN</span></span>
            </div>
            <p style={{ opacity:0.7, maxWidth:'300px' }}>Elegancia, precisión y color para tu vestir diario o tus emprendimientos.</p>
          </div>
          <div className="footer-links">
            <h4 style={{ color:'var(--accent-orange)', marginBottom:'0.5rem'}}>Enlaces</h4>
            <a href="#inicio">Regresar Arriba</a>
            <a href="#tienda">Catálogo</a>
            <a href="#servicios">Taller</a>
          </div>
          <div className="footer-links">
            <h4 style={{ color:'var(--accent-orange)', marginBottom:'0.5rem'}}>Soporte Directo</h4>
            <span style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}><Phone size={16}/> +54 9 351 612 1498</span>
            <span>Córdoba Capital, Argentina.</span>
          </div>
        </div>
        <div className="container footer-bottom">
          &copy; 2026 Summer Quen. Todos los derechos reservados.
        </div>
      </footer>

      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="floating-wa">
        <MessageCircle size={32} />
      </a>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3 style={{ fontSize:'1.5rem', fontWeight:700 }}>Carrito ({cartCount})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background:'transparent', border:'none', cursor:'pointer' }}><X size={24} /></button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div style={{ textAlign:'center', marginTop:'3rem', opacity:0.5 }}>
                  <ShoppingBag size={48} style={{ margin:'0 auto 1rem' }} />
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
                        <button onClick={() => updateCartItemQty(item.id, -1)}><Minus size={14}/></button>
                        <span style={{ fontSize:'0.9rem', fontWeight:600, width:'20px', textAlign:'center' }}>{item.quantity}</span>
                        <button onClick={() => updateCartItemQty(item.id, 1)} disabled={item.quantity >= item.stock}><Plus size={14}/></button>
                      </div>
                    </div>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={18}/></button>
                  </div>
                ))
              )}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total estimado</span>
                <span style={{ color:'var(--primary-green)' }}>{formatPrice(cartTotal)}</span>
              </div>
              <button disabled={cart.length === 0} onClick={sendWhatsAppOrder} className="btn btn-primary" style={{ width:'100%', padding:'1rem' }}>
                Hacer Pedido por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeProductDetail}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProductDetail} aria-label="Cerrar"><X size={20} /></button>
            <div className="modal-body">
              <div className="modal-img-container">
                <img src={selectedProduct.img} alt={selectedProduct.name} />
              </div>
              <div className="modal-info">
                <div className="modal-category">{selectedProduct.category}</div>
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <div className="modal-price">{formatPrice(selectedProduct.price)}</div>
                
                <div className="modal-desc">
                  {selectedProduct.description}
                </div>

                <div className={`modal-stock ${selectedProduct.stock < 5 ? 'low' : ''} ${selectedProduct.stock === 0 ? 'out' : ''}`}>
                  <span>Disponibilidad:</span> 
                  <strong style={{ marginLeft: 'auto' }}>
                    {selectedProduct.stock === 0 ? 'Sin stock temporalmente' : `${selectedProduct.stock} unidades en taller`}
                  </strong>
                </div>

                <div className="modal-controls">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <div className="qty-selector">
                      <button className="qty-btn" onClick={() => setDetailQty(Math.max(1, detailQty - 1))} disabled={detailQty <= 1}>
                        <Minus size={16} />
                      </button>
                      <input type="text" className="qty-input" value={detailQty} readOnly />
                      <button className="qty-btn" onClick={() => setDetailQty(Math.min(selectedProduct.stock, detailQty + 1))} disabled={detailQty >= selectedProduct.stock}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn btn-primary" style={{ flex: 1, padding: '1rem' }} onClick={addDetailToCart} disabled={selectedProduct.stock === 0}>
                      <ShoppingBag size={20} />
                      Sumar al Carrito
                    </button>
                  </div>
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
