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
    fileSize: 1024 * 1024 * 1, // 1MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed!'), false);
    }
  },
});

export const getUsers = async (req, res) => {
  const result = await db.query(
    `
      SELECT
        ID,
        "imgUrl",
        "firstName",
        "lastName",
        EMAIL,
        "isAdmin",
        "createdAt",
        "updatedAt",
        STATUS
      FROM
        USERS
      ORDER BY
        "createdAt" DESC;
    `
  );

  res.json({ users: result.rows });
};

export const updateUser = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.log(
          'error uploading file to server - uploadTest:',
          err.message
        );

        res.status(400).json({ msg: 'Upload failed', error: err.message });
      } else {
        if (req.file) {
          const filePath = req.file.path
            .replace(/\\/g, '/')
            .replace('public', 'http://localhost:3000/static');

          console.log(filePath);

          req.body.imgUrl = filePath;
        }

        const { id } = req.params;
        const parsedId = parseInt(id);
        const { firstName, lastName, email, isAdmin, imgUrl, status } =
          req.body;
        const values = [parsedId, firstName, lastName];
        let query;

        if (typeof isAdmin !== 'undefined') {
          // for admin (backoffice)
          values.push(isAdmin);
          values.push(status);
          query = `UPDATE users SET "firstName"=$2, "lastName"=$3, "isAdmin"=$4, status=$5`;
        } else {
          // for user (frontofficecls )
          values.push(email);
          query = `UPDATE users SET "firstName"=$2, "lastName"=$3, email=$4`;

          if (imgUrl) {
            query += ', "imgUrl"=$5';
            values.push(imgUrl);
          }
        }

        query += ` WHERE id = $1
      RETURNING id, "imgUrl", "firstName", "lastName", email, "isAdmin";`;

        const result = await db.query({
          text: query,
          values,
        });

        console.log(result.rows[0]);
        res.status(200).json({ user: result.rows[0] });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};
