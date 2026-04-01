const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
require('dotenv').config();

async function resetAdminPassword() {
  try {
    const password = 'ImportStorelr2026';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log('Actualizando contraseña de admin@importstore.com...');
    
    const [result] = await pool.execute(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [hash, 'admin@importstore.com']
    );

    if (result.affectedRows > 0) {
      console.log('✅ ¡Contraseña de Admin actualizada con éxito!');
    } else {
      console.log('❌ No se encontró el usuario admin@importstore.com.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
