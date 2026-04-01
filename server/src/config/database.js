const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a professional generic connection pool rather than single connections
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'import_store',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// A quick health check snippet we can import anywhere
const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Base de datos conectada exitosamente a Import Store.');
        connection.release();
    } catch (err) {
        console.error('❌ Error crítico al conectar la base de datos:', err.code, err.message);
        if (err.code === 'ECONNREFUSED') {
            console.error('¿Está corriendo el servicio de MySQL local en el puerto 3306?');
        }
    }
}

module.exports = {
    pool,
    checkConnection
};
