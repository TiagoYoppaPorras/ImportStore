const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Multer config (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * @route POST /api/upload
 * @desc Sube una imagen a Cloudinary desde el servidor
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se subió ningún archivo' });
    }

    // Convert Buffer to Stream for Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'importstore_products' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        Readable.from(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    return res.status(200).json({
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error('Server Upload Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al subir a Cloudinary desde el servidor',
      error: error.message 
    });
  }
});

module.exports = router;
