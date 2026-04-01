import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { FaBox, FaSignOutAlt, FaChartLine, FaUsers, FaArrowLeft, FaClipboardList } from 'react-icons/fa';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F0F0F', color: '#E0E0E0' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ 
        width: '260px', borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem',
        position: 'sticky', top: 0, height: '100vh'
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', borderBottom: '1px solid var(--accent-primary)', paddingBottom: '0.5rem', display: 'inline-block' }}>
            ADMIN<span style={{ color: 'var(--accent-primary)' }}>STORE</span>
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '5px' }}>
            Panel de Gestión v1.1
          </p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/admin" className="btn-admin-nav" style={navStyle}>
            <FaChartLine /> Dashboard
          </Link>
          <Link to="/admin" className="btn-admin-nav" style={navStyle}>
            <FaBox /> Inventario
          </Link>
          <Link to="/admin/ordenes" className="btn-admin-nav" style={navStyle}>
            <FaClipboardList /> Órdenes
          </Link>
          <Link to="/admin" className="btn-admin-nav" style={navStyle}>
            <FaUsers /> Usuarios
          </Link>
          
          <div style={{ margin: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}></div>
          
          <Link to="/" style={{ ...navStyle, color: 'var(--text-secondary)' }}>
            <FaArrowLeft /> Volver a Tienda
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>{user?.name}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Administrador</p>
          </div>
          <button onClick={handleLogout} className="btn-logout" style={{ 
            width: '100%', padding: '12px', borderRadius: '8px', 
            background: 'rgba(255,59,48,0.1)', color: '#FF3B30',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s'
          }}>
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  borderRadius: '10px',
  gap: '12px',
  fontSize: '0.95rem',
  fontWeight: '500',
  transition: 'all 0.2s',
  background: 'transparent',
  color: 'inherit'
};
