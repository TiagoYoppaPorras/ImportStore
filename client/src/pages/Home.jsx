import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaMapMarkerAlt, FaTruck, FaWhatsapp } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="home-container" style={{ width: '100%', overflow: 'hidden' }}>
      {/* Hero Section */}
      <section 
        className="hero-gradient" 
        style={{ 
          minHeight: '85vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Glow Effects */}
        <div style={{
          position: 'absolute', top: '10%', left: '20%', width: '400px', height: '400px',
          background: 'var(--accent-glow)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0
        }}></div>

        <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Elevá tu estilo con <br />
            <span style={{ color: 'var(--accent-primary)' }}>Import Store</span>
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', 
            margin: '0 auto 2.5rem', fontWeight: '400' 
          }}>
            Venta minorista y mayorista. Tecnología premium, cosmética exclusiva y perfumería importada directamente en tus manos.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <Link to="/productos" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
              <FaBoxOpen /> Ver Productos
            </Link>
            <a 
              href="https://wa.me/5493804524621?text=quiero%20comprar%20por%20mayor%20en%20imporStore%2C%20necesito%20cotizar%20los%20siguientes%20productos%3A%0A" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline" 
              style={{ padding: '16px 36px', fontSize: '1.1rem' }}
            >
              Cotizar por Mayor
            </a>
          </div>

          {/* Trust Indicators / Shipping */}
          <div className="glass" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem', padding: '2rem', borderRadius: 'var(--radius-lg)', marginTop: '2rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent-primary)', fontSize: '2rem' }}>
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Entregas Presenciales</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Puntos de retiro exclusivos en <strong>La Rioja</strong> y <strong>Córdoba Capital</strong>.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent-primary)', fontSize: '2rem' }}>
                <FaTruck />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Envíos a todo el país</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Despachos seguros al resto de la Argentina vía correo postal.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--success)', fontSize: '2rem' }}>
                <FaWhatsapp />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Atención personalizada</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Cotización directa para clientes mayoristas 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mini Catalog Teaser */}
      <section className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Nuestras Categorías</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <Link to="/productos" className="glass" style={{ padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', transition: 'transform 0.3s', cursor: 'pointer', display: 'block' }}>
            <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', marginBottom: '1rem' }}>📱 Gadgets</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Tecnología Apple, cargadores, AirPods y proyectores premium.</p>
          </Link>

          <Link to="/productos" className="glass" style={{ padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', transition: 'transform 0.3s', cursor: 'pointer', display: 'block' }}>
            <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', marginBottom: '1rem' }}>✨ Cosméticos</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Cuidado capilar intensivo con Karseell original.</p>
          </Link>

          <Link to="/productos" className="glass" style={{ padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', transition: 'transform 0.3s', cursor: 'pointer', display: 'block' }}>
            <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', marginBottom: '1rem' }}>💎 Perfumes</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Fragancias árabes e importadas seleccionadas.</p>
          </Link>

        </div>
      </section>

    </div>
  );
}
