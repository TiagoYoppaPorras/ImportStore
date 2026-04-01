const { pool } = require('../config/database');
require('dotenv').config();

async function migrate() {
    try {
        console.log('Agregando columna main_image_url a la tabla products...');
        
        // Check if column exists first to avoid error
        const [columns] = await pool.query('SHOW COLUMNS FROM products LIKE "main_image_url"');
        
        if (columns.length === 0) {
            await pool.execute('ALTER TABLE products ADD COLUMN main_image_url TEXT AFTER stock;');
            console.log('✅ Columna main_image_url agregada con éxito.');
        } else {
            console.log('ℹ️ La columna main_image_url ya existe.');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en el cambio de base de datos:', error.message);
        process.exit(1);
    }
}

migrate();
