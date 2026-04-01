const express = require('express');
const router = express.Router();

const productRoutes = require('./product.routes');
const authRoutes = require('./auth.routes');
const orderRoutes = require('./order.routes');
const uploadRoutes = require('./upload.routes');

// Mount the product routes to /products
router.use('/products', productRoutes);

// Mount the auth routes to /auth
router.use('/auth', authRoutes);

// Mount the order routes to /orders
router.use('/orders', orderRoutes);

// Mount the upload routes to /upload
router.use('/upload', uploadRoutes);

// Export main router
module.exports = router;
