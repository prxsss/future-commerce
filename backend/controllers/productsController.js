import db from '../services/database.js';

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

    console.log(result.rows);
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
    console.log(req.body);
    const { name, description, price, stock, categoryId, imgUrlLarge } =
      req.body;

    const result = await db.query({
      text: `
            INSERT INTO public.products(
            name, description, price, stock, "categoryId", "imgUrlLarge")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
            `,
      values: [name, description, price, stock, categoryId, imgUrlLarge],
    });

    console.log('product', result.rows[0]);
    res.status(201).json({ product: result.rows[0] });
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
