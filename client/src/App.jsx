import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import WhatsAppButton from './components/common/WhatsAppButton';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: { background: '#333', color: '#fff' }
        }} 
      />
      <WhatsAppButton />
      <AppRoutes />
    </div>
  );
}

export default App;
