import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaWhatsapp, FaSyncAlt, FaSearch, FaEye } from 'react-icons/fa';
import { API_BASE_URL } from '../../config';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(data.data || []);
    } catch (error) {
      toast.error('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/${id}/status`, { status });
      toast.success('Estado actualizado');
      fetchOrders();
    } catch (error) {
      toast.error('No se pudo actualizar el estado');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.customer_name && o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'paid': return '#25D366';
      case 'shipped': return '#4A90E2';
      case 'delivered': return '#00C853';
      case 'cancelled': return '#FF3B30';
      default: return 'var(--text-tertiary)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Gestión de Órdenes</h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Seguimiento de pedidos y ventas</p>
        </div>
        <button onClick={fetchOrders} className="btn btn-outline" style={{ padding: '10px 20px', borderRadius: '10px' }}>
          <FaSyncAlt /> Refrescar
        </button>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Historial Completo</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <FaSearch style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Buscar por #Orden o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-tertiary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1.25rem 1.5rem' }}>ID Orden</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Fecha</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Total</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Estado</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody style={{ color: '#E0E0E0' }}>
              {loading ? (
                 <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>Cargando órdenes...</td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id} className="admin-tr" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{order.order_number}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{order.customer_name || 'Invitado (WA)'}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem' }}>
                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: '800' }}>
                    ${Number(order.total).toLocaleString('es-AR')}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      style={{ 
                        background: 'transparent', color: getStatusColor(order.status),
                        border: `1px solid ${getStatusColor(order.status)}`,
                        padding: '4px 8px', borderRadius: '4px', outline: 'none'
                      }}
                    >
                      <option value="pending" style={{ background: '#1c1c1e' }}>Pendiente</option>
                      <option value="paid" style={{ background: '#1c1c1e' }}>Pagado</option>
                      <option value="shipped" style={{ background: '#1c1c1e' }}>Enviado</option>
                      <option value="delivered" style={{ background: '#1c1c1e' }}>Entregado</option>
                      <option value="cancelled" style={{ background: '#1c1c1e' }}>Cancelado</option>
                    </select>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <a 
                        href={`https://wa.me/5493804524621`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-action" 
                        style={{ ...actionBtnStyle, color: '#25D366', background: 'rgba(37,211,102,0.05)' }}
                       >
                         <FaWhatsapp />
                       </a>
                       <button className="btn-action" style={actionBtnStyle} onClick={() => toast.error('Detalles en desarrollo')}>
                         <FaEye />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const actionBtnStyle = {
  padding: '8px',
  borderRadius: '6px',
  background: 'rgba(255,255,255,0.05)',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.9rem',
  transition: 'all 0.2s'
};
