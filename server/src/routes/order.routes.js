const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

// Public checkout route
// We use a middleware that doesn't block if there is no user
const optionalAuth = (req, res, next) => {
    try {
        const { authMiddleware } = require('../middlewares/auth.middleware');
        authMiddleware(req, res, () => {
            next();
        });
    } catch {
        next();
    }
};

router.post('/', OrderController.create);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, OrderController.getAll);
router.put('/:id/status', authMiddleware, adminMiddleware, OrderController.updateStatus);

module.exports = router;
