const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const startServer = async () => {
    try {
        // Connect to database before starting to serve requests
        const { checkConnection } = require('./config/database');
        await checkConnection();
        
        
        server.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Handle unhandled Promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
