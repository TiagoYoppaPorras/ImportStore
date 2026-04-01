import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5493804524621"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float animate-pulse"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: '#25D366',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '35px',
        boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
        zIndex: 100,
        transition: 'transform 0.3s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <FaWhatsapp />
    </a>
  );
}
