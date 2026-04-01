const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    console.log('Probando subida al servidor (Fetch)...');
    
    const filePath = path.join(__dirname, '../../../client/public/favicon.svg');
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/svg+xml' });
    
    const formData = new FormData();
    formData.append('file', blob, 'favicon.svg');

    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    
    if (res.ok) {
      console.log('✅ Subida exitosa:', data.secure_url);
      process.exit(0);
    } else {
      console.error('❌ Error en el servidor:', data);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error de red/cuelgue:', error.message);
    process.exit(1);
  }
}

testUpload();
