const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSQLFile(connection, filePath) {
    const sql = fs.readFileSync(filePath, 'utf8');
    // Split the script by ';' since execute/query might fail with multiple statements unless multiple statements is enabled
    // The safest way is to connect with multipleStatements: true
    console.log(`Ejecutando script: ${path.basename(filePath)}...`);
    await connection.query(sql);
}

async function setup() {
    try {
        console.log('Conectando a MySQL con las credenciales de tu .env...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true // This is crucial to execute the DDL and seeds correctly
        });

        const schemaPath = path.join(__dirname, '../../../database/schema.sql');
        const seedPath = path.join(__dirname, '../../../database/seed.sql');

        console.log('Creando estructura de base de datos (tablas, relaciones, índices)...');
        await runSQLFile(connection, schemaPath);

        console.log('Poblando base de datos con información inicial (seed)...');
        await runSQLFile(connection, seedPath);

        console.log('✅ ¡Base de datos import_store recreada e inicializada con éxito!');
        
        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error fatal al inicializar la base de datos:', error.message);
        process.exit(1);
    }
}

setup();
