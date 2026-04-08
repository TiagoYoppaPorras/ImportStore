import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';

import { API_BASE_URL } from '../config';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/products`);
        setProducts(data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('No pudimos cargar los productos en este momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addItem(product);
    toast.success(`${product.name} agregado al carrito!`, {
      style: {
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--accent-primary)',
      },
      iconTheme: {
        primary: 'var(--accent-primary)',
        secondary: '#000',
      },
    });
  };

  const [activeCategory, setActiveCategory] = useState("Gadgets");
  const [activeGender, setActiveGender] = useState("Todos");

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const cat = product.category_name || 'Otros';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(product);
    return acc;
  }, {});

  // For enforcing the order requested: Gadgets, Perfumes, Cosméticos
  const categoryOrder = ["Gadgets", "Perfumes", "Cosméticos"];
  const sortedCategories = Object.keys(productsByCategory).sort((a, b) => {
    let indexA = categoryOrder.indexOf(a);
    let indexB = categoryOrder.indexOf(b);
    if (indexA === -1) indexA = 999;
    if (indexB === -1) indexB = 999;
    return indexA - indexB;
  });

  // Only get the products for the active tab
  let activeProducts = productsByCategory[activeCategory] || [];

  // Filter by gender if category is Perfumes
  if (activeCategory === "Perfumes" && activeGender !== "Todos") {
    activeProducts = activeProducts.filter(p => p.gender === activeGender);
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        Catálogo Exclusivo
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '4rem' }}>
        Encuentra lo mejor en tecnología y belleza, importado para vos.
      </p>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--accent-primary)' }}>
          <h2>Cargando inventario...</h2>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--error)' }}>
          <p>{error}</p>
        </div>
      )}

      {/* Category Tabs */}
      {!loading && !error && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
          {categoryOrder.map(cat => (
             <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveGender("Todos"); // Reset gender filter when changing categories
                }}
                className={activeCategory === cat ? "btn btn-primary" : "btn btn-outline"}
                style={{ padding: '8px 24px', borderRadius: '50px', fontSize: '0.95rem' }}
             >
                {cat}
             </button>
          ))}
        </div>
      )}

      {/* Sub-filters for Perfumes Gender */}
      {!loading && !error && activeCategory === "Perfumes" && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {["Todos", "Masculino", "Femenino", "Unisex"].map(gen => (
            <button
              key={gen}
              onClick={() => setActiveGender(gen)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                border: '1px solid',
                borderColor: activeGender === gen ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                background: activeGender === gen ? 'rgba(212,175,55,0.1)' : 'transparent',
                color: activeGender === gen ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {gen === "Todos" ? "Todos" : gen === "Masculino" ? "Hombre" : gen === "Femenino" ? "Mujer" : "Unisex"}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid For Active Category */}
      {!loading && !error && (
        <div style={{ marginBottom: '5rem' }}>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {activeProducts.map((product) => (
              <div key={product.id} className="glass card-hover" style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {/* Product Image */}
                <div className="product-image" style={{ 
                  height: '240px', 
                  background: 'rgba(255,255,255,0.02)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {product.main_image_url ? (
                    <img 
                      src={product.main_image_url} 
                      alt={product.name} 
                      className="animate-fade-in"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <span style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}>📦</span>
                  )}
                </div>
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '1px' }}>
                      {product.category_name}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', lineHeight: '1.3', fontWeight: '700' }}>{product.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.6' }}>
                    {product.short_description}
                  </p>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
                      ${Number(product.retail_price).toLocaleString('es-AR')}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '12px' }}
                    >
                      <FaShoppingCart /> Agregar
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Fallback empty state */}
      {!loading && products.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No hay productos disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
}
