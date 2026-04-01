import { API_BASE_URL } from '../config';

export default function Cart() {
  const { items, removeItem, clearCart, getTotal } = useCartStore();

  const handleCheckoutWhatsApp = async () => {
    try {
      // 1. Persist the order in the database first
      const orderData = {
        items,
        total: getTotal(),
        shipping_city: 'Consultar por WhatsApp'
      };

      const { data } = await axios.post(`${API_BASE_URL}/orders`, orderData);
      const orderNumber = data.data.order_number;

      // 2. Map items for WhatsApp message
      let msg = `🛍️ *NUEVO PEDIDO - IMPORT STORE*\n`;
      msg += `*ID Orden:* ${orderNumber}\n\n`;
      
      items.forEach(({ product, quantity }) => {
        msg += `▪️ ${quantity}x ${product.name} ($${Number(product.retail_price).toLocaleString('es-AR')})\n`;
      });
      msg += `\n*Total estimado:* $${getTotal().toLocaleString('es-AR')}`;
      
      // 3. Open WhatsApp and Clear Cart
      window.open(`https://wa.me/5493804524621?text=${encodeURIComponent(msg)}`, '_blank');
      
      toast.success('¡Orden registrada! Redirigiendo a WhatsApp...', {
        duration: 5000,
        style: { background: '#25D366', color: '#fff' }
      });

      clearCart();
    } catch (error) {
      console.error('Error recording order:', error);
      toast.error('No pudimos procesar tu orden en el sistema. Inténtalo de nuevo.');
    }
  };

  const handleRemove = (product) => {
    removeItem(product.id);
    toast.error(`${product.name} eliminado del carrito`, {
      style: { background: '#333', color: '#fff' }
    });
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        Tu Carrito
      </h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4em 0' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            Tu carrito está vacío.
          </p>
          <Link to="/productos" className="btn btn-primary" style={{ padding: '14px 32px' }}>
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
          
          {/* Items List */}
          <div>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="glass card-hover" style={{
                display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem',
                borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ width: '80px', height: '80px', background: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  📦
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', fontWeight: '700' }}>{product.name}</h3>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>SKU: {product.sku}</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '800', fontSize: '1.25rem', marginBottom: '0.75rem', color: '#fff' }}>
                    ${(Number(product.retail_price) * quantity).toLocaleString('es-AR')}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{quantity} unidad(es)</span>
                    <button 
                      onClick={() => handleRemove(product)}
                      style={{ 
                        color: 'var(--error)', 
                        padding: '8px', 
                        background: 'rgba(255,59,48,0.1)', 
                        borderRadius: '6px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,59,48,0.2)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,59,48,0.1)'}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Box */}
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', height: 'fit-content', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: '800' }}>Resumen</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
              <span>Productos ({items.length})</span>
              <span>${getTotal().toLocaleString('es-AR')}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.75rem', color: 'var(--text-secondary)' }}>
              <span>Envío</span>
              <span style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>A convenir</span>
            </div>

            <div style={{ 
              display: 'flex', justifyContent: 'space-between', 
              borderTop: '1px solid rgba(255,255,255,0.1)', 
              paddingTop: '1.75rem', marginBottom: '2.5rem',
              fontSize: '1.3rem', fontWeight: '800'
            }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent-primary)' }}>${getTotal().toLocaleString('es-AR')}</span>
            </div>

            <button 
              onClick={handleCheckoutWhatsApp}
              className="btn btn-whatsapp" 
              style={{ width: '100%', padding: '18px', fontSize: '1.15rem', marginBottom: '1.25rem', borderRadius: '12px' }}
            >
              Consultar por WhatsApp <FaArrowRight />
            </button>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: '1.6' }}>
              Te redirigiremos a WhatsApp para finalizar los detalles de entrega y pago de forma segura.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
