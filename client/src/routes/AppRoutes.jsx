import React, { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

// Layouts
const PublicLayout = lazy(() => import('../layouts/PublicLayout'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));

// Pages (Lazy Loaded for performance)
const Home = lazy(() => import('../pages/Home'));
const Products = lazy(() => import('../pages/Products'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Wholesale = lazy(() => import('../pages/Wholesale'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin Pages
const AdminLogin = lazy(() => import('../pages/admin/Login'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Orders = lazy(() => import('../pages/admin/Orders'));

import ProtectedRoute from '../components/auth/ProtectedRoute';

// Global loading spinner
const SuspenseFallback = () => <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--accent-primary)' }}>
  <h2>Cargando Import Store...</h2>
</div>;

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          {/* Default Public Layout wrapper */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<Products />} />
            <Route path="carrito" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="mayorista" element={<Wholesale />} />
          </Route>

          {/* Admin Routes with distinct Layout wrapper */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="ordenes" element={<Orders />} />
              </Route>
          </Route>

          {/* 404 Generic */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
