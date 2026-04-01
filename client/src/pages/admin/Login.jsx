import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Completa todos los campos');
    }

    const { success, message } = await login(email, password);
    if (success) {
      toast.success('¡Bienvenido de nuevo!');
      navigate('/admin');
    } else {
      toast.error(message);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1A1A1A 0%, #0A0A0A 100%)', padding: '1rem'
    }}>
      <div className="glass animate-fade-in" style={{ 
        width: '100%', maxWidth: '400px', padding: '3rem', borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            IMPORT<span style={{ color: 'var(--accent-primary)' }}>STORE</span>
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Dashboard Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <FaEnvelope style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-tertiary)' }} />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.2s'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <FaLock style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-tertiary)' }} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.2s'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', borderRadius: '10px', marginTop: '1rem', fontSize: '1rem' }}
          >
            {loading ? 'Ingresando...' : <><FaSignInAlt /> Iniciar Sesión</>}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', borderBottom: '1px solid transparent', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.target.style.color = '#fff'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-tertiary)'}
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
}
