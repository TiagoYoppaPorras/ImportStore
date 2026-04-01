const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Public route
router.post('/login', AuthController.login);

// Protected route
router.get('/verify', authMiddleware, AuthController.verify);

module.exports = router;
