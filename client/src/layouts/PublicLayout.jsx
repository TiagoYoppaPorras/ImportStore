import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaShoppingCart, FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa';
import { useCartStore } from '../store/useCartStore';

export default function PublicLayout() {
  const items = useCartStore((state) => state.items);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="glass" style={{ 
        position: 'sticky', top: 0, zIndex: 100, padding: '1rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <Link to="/" onClick={closeMobileMenu} style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            IMPORT<span style={{ color: 'var(--accent-primary)' }}>STORE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hide-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/productos" style={{ fontWeight: '500', transition: 'color var(--transition-fast)'}} 
                  onMouseOver={(e) => e.target.style.color = 'var(--accent-primary)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-primary)'}>
              Catálogo
            </Link>
            <Link to="/mayorista" style={{ fontWeight: '500', transition: 'color var(--transition-fast)'}} 
                  onMouseOver={(e) => e.target.style.color = 'var(--accent-primary)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-primary)'}>
              Mayorista
            </Link>
            
            <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
              <Link to="/carrito" className="btn btn-outline" style={{ padding: '8px 16px' }}>
                <FaShoppingCart /> <span style={{ fontSize: '0.9rem' }}>{items.length}</span>
              </Link>
              <a href="https://wa.me/5493804524621" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ padding: '8px 16px' }}>
                <FaWhatsapp />
              </a>
            </div>
          </nav>

          {/* Mobile UI Buttons */}
          <div className="show-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/carrito" className="btn btn-outline" style={{ padding: '6px 12px', border: 'none' }}>
              <FaShoppingCart size={20} />
              <span style={{ 
                position: 'absolute', top: '8px', right: '45px', 
                background: 'var(--accent-primary)', color: '#000', 
                fontSize: '0.7rem', width: '18px', height: '18px', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
              }}>
                {items.length}
              </span>
            </Link>
            <button 
              onClick={toggleMobileMenu} 
              style={{ color: '#fff', fontSize: '1.5rem', display: 'flex', alignItems: 'center', padding: '5px' }}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="animate-fade-in" style={{
            position: 'fixed', top: '70px', left: 0, width: '100%', height: 'calc(100vh - 70px)',
            background: 'rgba(10, 10, 10, 0.98)', backdropFilter: 'blur(10px)',
            zIndex: 90, display: 'flex', flexDirection: 'column', padding: '2rem'
          }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.5rem', fontWeight: '600' }}>
              <li>
                <Link to="/productos" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 0' }}>Catálogo</Link>
              </li>
              <li>
                <Link to="/mayorista" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 0' }}>Mayorista</Link>
              </li>
              <li>
                <Link to="/carrito" onClick={closeMobileMenu} style={{ display: 'block', padding: '10px 0', color: 'var(--accent-primary)' }}>Mi Carrito ({items.length})</Link>
              </li>
            </ul>
            
            <div style={{ marginTop: 'auto', paddingBottom: '2rem' }}>
              <a 
                href="https://wa.me/5493804524621" 
                className="btn btn-whatsapp" 
                style={{ width: '100%', padding: '16px', borderRadius: '12px', gap: '15px' }}
              >
                <FaWhatsapp size={24} /> Contactar Ventas
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer style={{ 
        background: 'var(--bg-secondary)', padding: '4rem 0 2rem', 
        borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem' }}>IMPORT<span style={{ color: 'var(--accent-primary)' }}>STORE</span></h3>
            <p>Tu aliado estratégico para compras minoristas y mayoristas en Argentina.</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.2rem' }}>Enlaces Rápidos</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link to="/productos">Ver Productos</Link></li>
              <li><Link to="/mayorista">Cotizar Mayorista</Link></li>
              <li><Link to="/carrito">Mi Carrito</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.2rem' }}>Contacto</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>La Rioja / Córdoba Capital</li>
              <li>Envíos a todo el país</li>
              <li>WA: +54 9 3804 524621</li>
            </ul>
          </div>
        </div>
        <div className="container" style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p>© {new Date().getFullYear()} Import Store. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
