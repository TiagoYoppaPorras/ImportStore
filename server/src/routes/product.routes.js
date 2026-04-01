const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

// Public route to get all products
router.get('/', ProductController.getAll);

// Public route to get by ID
router.get('/:id', ProductController.getById);

// Protected routes (Only Admin)
router.post('/', authMiddleware, adminMiddleware, ProductController.create);
router.put('/:id', authMiddleware, adminMiddleware, ProductController.update);
router.delete('/:id', authMiddleware, adminMiddleware, ProductController.delete);

module.exports = router;
