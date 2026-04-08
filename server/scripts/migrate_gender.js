const { pool } = require('../src/config/database');

async function migrate() {
    try {
        console.log('🚀 Iniciando migración: Añadiendo columna "gender" a "products"...');
        
        const query = `
            ALTER TABLE products 
            ADD COLUMN gender ENUM('Masculino', 'Femenino', 'Unisex') DEFAULT 'Unisex' AFTER category_id;
        `;
        
        await pool.query(query);
        
        console.log('✅ Migración completada exitosamente.');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN') {
            console.log('ℹ️ La columna "gender" ya existe en la base de datos.');
            process.exit(0);
        } else {
            console.error('❌ Error durante la migración:', error);
            process.exit(1);
        }
    }
}

migrate();
