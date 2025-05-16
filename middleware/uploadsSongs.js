// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create folders if not exist
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
};
createFolder('uploads/covers');
createFolder('uploads/songs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'coverImage') cb(null, 'uploads/covers/');
    else cb(null, 'uploads/songs/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;
