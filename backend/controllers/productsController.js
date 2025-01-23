import db from '../services/database.js';
import multer from 'multer';
import path from 'path';
import __dirname from '../index.js';
import sharp from 'sharp';

// Configure Multer to store images in memory
const upload = multer({
  storage: multer.memoryStorage(), // memory storage
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed!'), false);
    }
  },
});

export const getProducts = async (req, res) => {
  try {
    const result = await db.query(
      `
        SELECT 
          products.id, 
          products.name, 
          products.description, 
          price, quantity, 
          "categoryId", 
          categories.name AS "categoryName", 
          "createdAt", 
          "updatedAt", 
          "imgUrlLarge", 
          "imgUrlSmall", 
          "currentStock", 
          "minimumStockLevel", 
          "maximumStockLevel", 
          "regularPrice", 
          "salePrice"
        FROM 
          products
        INNER JOIN 
          categories ON products."categoryId" = categories.id
        ORDER BY 
          "updatedAt" DESC;
      `
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Products not found.' });
    }

    // console.log(result.rows);
    res.status(200).json({ products: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      console.log('No id provided.');
      return res.status(400).json({ msg: 'No id provided.' });
    }

    const result = await db.query({
      text: `
            SELECT id, name, description, price, stock, "categoryId", "imgUrlLarge", "imgUrlSmall" FROM  products
            WHERE id=$1;
            `,
      values: [id],
    });

    if (result.rows.length === 0) {
      console.log('Product not found.');
      return res.status(404).json({ msg: 'Product not found.' });
    }

    res.status(200).json({ product: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const addProduct = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal server error.' });
      } else {
        if (req.file) {
          const largeImgUploadDir = path.join(
            __dirname,
            'public',
            'img',
            'products',
            'large'
          );
          const smallImgUploadDir = path.join(
            __dirname,
            'public',
            'img',
            'products',
            'small'
          );

          const largeImgPath = path.join(
            largeImgUploadDir,
            req.file.originalname
          );
          const smallImgPath = path.join(
            smallImgUploadDir,
            req.file.originalname
          );

          await Promise.all([
            sharp(req.file.buffer).jpeg().toFile(largeImgPath),
            sharp(req.file.buffer).resize(350, 350).jpeg().toFile(smallImgPath),
          ]);

          // console.log(__dirname);
          // console.log(largeImgUploadDir);
          // console.log(smallImgUploadDir);
          // console.log(req.file.originalname);
          console.log(largeImgPath);

          const largeImgFilePath = largeImgPath
            .replace(/\\/g, '/')
            .replace(
              /^C:\/Users\/prosss\/Desktop\/Dev-CTRs\/development\/future-commerce\/backend\/public/,
              'http://localhost:3000/static'
            );
          const smallImgFilePath = smallImgPath
            .replace(/\\/g, '/')
            .replace(
              /^C:\/Users\/prosss\/Desktop\/Dev-CTRs\/development\/future-commerce\/backend\/public/,
              'http://localhost:3000/static'
            );

          req.body.imgUrlLarge = largeImgFilePath;
          req.body.imgUrlSmall = smallImgFilePath;
        }

        console.log(req.body);

        const {
          name,
          description,
          categoryId,
          regularPrice,
          salePrice,
          currentStock,
          minimumStockLevel,
          maximumStockLevel,
          imgUrlLarge,
          imgUrlSmall,
        } = req.body;

        const result = await db.query({
          text: `
                INSERT INTO
                  products (
                    name,
                    description,
                    "categoryId",
                    "regularPrice",
                    "salePrice",
                    "currentStock",
                    "minimumStockLevel",
                    "maximumStockLevel",
                    "imgUrlLarge",
                    "imgUrlSmall"
                  )
                VALUES
                  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING
                  *;
                `,
          values: [
            name,
            description,
            categoryId,
            regularPrice,
            salePrice,
            currentStock,
            minimumStockLevel,
            maximumStockLevel,
            imgUrlLarge,
            imgUrlSmall,
          ],
        });

        console.log('product', result.rows[0]);
        res.status(201).json({ product: result.rows[0] });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const {
      name,
      description,
      price,
      quantity,
      categoryId,
      imgUrlLarge,
      imgUrlSmall,
    } = req.body;

    const result = await db.query({
      text: `
            UPDATE public.products
            SET name=$2, description=$3, price=$4, quantity=$5, "categoryId"=$6, "imgUrlLarge"=$7, "imgUrlSmall"=$8
            WHERE id=$1;
            `,
      values: [
        parsedId,
        name,
        description,
        price,
        quantity,
        categoryId,
        imgUrlLarge,
        imgUrlSmall,
      ],
    });

    res.status(200).json({ msg: 'Product updated successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    console.log('deleteProduct');

    const { id } = req.params;
    const parsedId = parseInt(id);

    if (!parsedId) {
      console.log('No id provided.');
      return res.status(400).json({ msg: 'No id provided.' });
    }

    const result = await db.query({
      text: `
            DELETE FROM public.products
            WHERE id=$1; 
            `,
      values: [parsedId],
    });

    res.status(200).json({ msg: 'Product deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};
