import db from '../services/database.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/users');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed!'), false);
    }
  },
});

export const uploadTest = async (req, res) => {
  try {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.log(
          'error uploading file to server - uploadTest:',
          err.message
        );
        res.status(400).json({ msg: 'Upload failed', error: err.message });
      } else {
        const filePath = req.file.path
          .replace(/\\/g, '/')
          .replace('public', 'http://localhost:3000/static');
        console.log(filePath);
        res.status(200).json({ msg: 'File uploaded successfully.' });
      }
    });
  } catch (error) {
    console.log('uploadTest', error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};
