const express = require('express');
const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// require('express-async-errors');

const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' })); // Configure properly in production
// app.use(helmet());
// app.use(morgan('dev'));

// Routes
const routes = require('./routes/index');
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
