const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración LOCAL
const localConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'import_store'
};

// Configuración RAILWAY (Pública)
const railwayUrl = 'mysql://root:BJxxNpXhaGanFNGLiJGzkKEzFlaQiTTE@interchange.proxy.rlwy.net:47395/railway';

async function migrate() {
  let localConn, railwayConn;
  try {
    console.log('--- Iniciando Migración a Railway Cloud ---');
    
    localConn = await mysql.createConnection(localConfig);
    railwayConn = await mysql.createConnection(railwayUrl);

    console.log('✅ Conectado a ambas bases de datos.');

    // 1. Obtener Tablas Locales
    const [tables] = await localConn.execute('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);

    // Desactivar checks de FK para poder recrear tablas en cualquier orden
    await railwayConn.execute('SET FOREIGN_KEY_CHECKS = 0');

    for (const tableName of tableNames) {
      console.log(`\nMigrando tabla: ${tableName}...`);
      
      const [[createTableResult]] = await localConn.execute(`SHOW CREATE TABLE ${tableName}`);
      const createSql = createTableResult['Create Table'];

      await railwayConn.execute(`DROP TABLE IF EXISTS ${tableName}`);
      await railwayConn.execute(createSql);
      console.log(`   - Estructura creada.`);

      const [rows] = await localConn.execute(`SELECT * FROM ${tableName}`);
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]).map(c => `\`${c}\``).join(', ');
        const placeholders = Object.keys(rows[0]).map(() => '?').join(', ');
        const values = rows.map(row => Object.values(row));

        for (const val of values) {
          await railwayConn.execute(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`, val);
        }
        console.log(`   - ${rows.length} registros migrados.`);
      } else {
        console.log('   - Tabla vacía, saltando datos.');
      }
    }

    await railwayConn.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n--- ✅ MIGRACIÓN COMPLETADA CON ÉXITO ---');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA MIGRACIÓN:', error.message);
    process.exit(1);
  } finally {
    if (localConn) await localConn.end();
    if (railwayConn) await railwayConn.end();
  }
}

migrate();
