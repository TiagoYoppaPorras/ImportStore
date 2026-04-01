const { pool } = require('../config/database');
require('dotenv').config();

async function migrate() {
    try {
        console.log('Haciendo que las columnas de precio sean opcionales...');
        
        await pool.execute('ALTER TABLE products MODIFY COLUMN retail_price DECIMAL(10,2) NULL;');
        await pool.execute('ALTER TABLE products MODIFY COLUMN wholesale_price DECIMAL(10,2) NULL;');
        
        console.log('✅ Base de datos actualizada con éxito.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en el cambio de base de datos:', error.message);
        process.exit(1);
    }
}

migrate();
