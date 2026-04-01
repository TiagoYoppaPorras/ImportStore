const { pool } = require('../config/database');
require('dotenv').config();

async function migrate() {
    try {
        console.log('Modificando tabla de órdenes...');
        await pool.execute('ALTER TABLE orders MODIFY COLUMN user_id INT UNSIGNED NULL;');
        console.log('✅ Tabla orders modificada correctamente (user_id es opcional).');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en el cambio de base de datos:', error.message);
        process.exit(1);
    }
}

migrate();
