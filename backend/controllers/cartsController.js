import { text } from 'express';
import db from '../services/database.js';

export const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const parsedUserId = parseInt(userId);

    if (!parsedUserId) {
      console.log('No userId provided.');
      return res.status(400).json({ msg: 'No userId provided.' });
    }

    // const result = await db.query({
    //   text: `
    //         SELECT
    //           carts.id,
    //           "userId",
    //           CONCAT(users."firstName", ' ', users."lastName") AS "fullName",
    //           status,
    //           "productId",
    //           products.name,
    //           quantity,
    //           "cartItems".price
    //         FROM carts
    //         INNER JOIN users ON carts."userId" = users.id
    //         INNER JOIN "cartItems" ON carts.id = "cartItems"."cartId"
    //         INNER JOIN products ON "cartItems"."productId" = products.id
    //         WHERE "userId" = $1 AND status = 'active';
    //         `,
    //   values: [parsedUserId],
    // });

    const cart = await db.query({
      text: `
            SELECT * 
            FROM carts
            WHERE "userId" = $1;
            `,
      values: [parsedUserId],
    });

    // if cart on that user id doesn't exist then exit with 404
    if (cart.rows.length === 0) {
      console.log('Cart not found.');

      return res.status(404).json({ msg: 'Cart not found.' });
    }

    // if cart on that user id exists
    const cartId = cart.rows[0].id;

    const cartItems = await db.query({
      text: `
            SELECT
              "cartItems".id AS "cartItemId",  
              products.id AS "productId",
              "imgUrlLarge", 
              "imgUrlSmall", 
              name,
              description,
              products.price, 
              "categoryId",
              products.quantity AS "productQuantity",
              "cartItems".quantity AS "cartItemQuantity"
            FROM
              PUBLIC."cartItems"
            INNER JOIN products ON "cartItems"."productId" = products.id
            WHERE
              "cartId" = $1
            ORDER BY
              "cartItems"."createdAt" DESC;
            `,
      values: [cartId],
    });

    res
      .status(200)
      .json({ msg: 'Cart found.', cartId: cartId, cartItems: cartItems.rows });
  } catch (error) {
    console.log('getCartByUserId', error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await db.query({
      text: `
            SELECT * 
            FROM carts
            WHERE "userId" = $1;
            `,
      values: [userId],
    });

    let cartId;

    if (cart.rows.length === 0) {
      const newCart = await db.query({
        text: `
              INSERT INTO carts 
              ("userId") 
              VALUES ($1) 
              RETURNING id;`,
        values: [userId],
      });
      cartId = newCart.rows[0].id;
    } else {
      cartId = cart.rows[0].id;
    }

    const existingItem = await db.query({
      text: `
            SELECT * 
            FROM "cartItems" 
            WHERE "cartId" = $1 AND "productId" = $2;`,
      values: [cartId, productId],
    });

    let cartItemId;

    if (existingItem.rows.length === 0) {
      const newItem = await db.query({
        text: `
              INSERT INTO "cartItems" 
              ("cartId", "productId", quantity) 
              VALUES ($1, $2, $3)
              RETURNING id;`,
        values: [cartId, productId, quantity],
      });
      cartItemId = newItem.rows[0].id;
    } else {
      const updateItem = await db.query({
        text: `
              UPDATE "cartItems"
              SET quantity = quantity + $3
              WHERE "cartId" = $1 AND "productId" = $2
              RETURNING id;`,
        values: [cartId, productId, quantity],
      });
      cartItemId = updateItem.rows[0].id;
    }

    console.log('Product added to cart successfully.');
    console.log('cartItemId:', cartItemId);

    res.status(201).json({
      msg: 'Product added to cart successfully.',
      cartItemId,
    });
  } catch (error) {
    console.log('addItemToCart', error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const removeItemInCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const parsedCartItemId = parseInt(cartItemId);

    console.log('cartItemId:', cartItemId);

    await db.query({
      text: `
            DELETE FROM "cartItems"
            WHERE id = $1;
            `,
      values: [parsedCartItemId],
    });

    console.log('Product removed from cart successfully.');
    console.log('cartItemId:', parsedCartItemId);

    res.status(200).json({ msg: 'Product removed from cart successfully.' });
  } catch (error) {
    console.log('removeItemInCart', error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const updateItemInCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const parsedCartItemId = parseInt(cartItemId);
    const { quantity } = req.body;

    await db.query({
      text: `
            UPDATE "cartItems" 
            SET quantity = $2
            WHERE id = $1; 
            `,
      values: [parsedCartItemId, quantity],
    });

    res.status(200).json({ msg: 'Cart item updated successfully.' });
  } catch (error) {
    console.log('updateItemInCart:', error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await db.query({
      text: `
            DELETE FROM "cartItems"
            WHERE "cartId" = (
              SELECT id
              FROM carts
              WHERE "userId" = $1
            ); 
            `,
      values: [userId],
    });

    console.log('Cart cleared successfully.');
    res.status(200).json({ msg: 'Cart cleared successfully.' });
  } catch (error) {
    console.log('clearCart:', error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const checkout = async (req, res) => {
  try {
    const { userId, total, shippingAddress, shippingNote } = req.body;

    if (!userId || !total || !shippingAddress) {
      return res.status(400).json({ msg: 'Missing required fields.' });
    }

    const orderDetails = await db.query({
      text: `
            INSERT INTO "orderDetails" 
            ("userId", total, "shippingAddress", "shippingNote", status)
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING *;
            `,
      values: [userId, total, shippingAddress, shippingNote],
    });

    if (orderDetails.rows.length === 0) {
      return res.status(500).json({ msg: 'Internal server error.' });
    }

    const { id: orderId } = orderDetails.rows[0];

    const cartItems = await db.query({
      text: `
            SELECT "productId", quantity
            FROM "cartItems"
            WHERE "cartId" = (
              SELECT id
              FROM carts
              WHERE "userId" = $1
            );
            `,
      values: [userId],
    });

    if (cartItems.rows.length === 0) {
      return res.status(500).json({ msg: 'Internal server error.' });
    }

    cartItems.rows.forEach(async (item) => {
      const { productId, quantity } = item;
      const result = await db.query({
        text: `INSERT INTO "orderItems"
              ("orderId", "productId", quantity)
              VALUES ($1, $2, $3)
              RETURNING *;`,
        values: [orderId, productId, quantity],
      });

      await db.query({
        text: `UPDATE products
              SET "currentStock" = "currentStock" - $1
              WHERE id = $2;`,
        values: [quantity, productId],
      });

      console.log(result.rows[0]);
    });

    await db.query({
      text: `
            DELETE FROM "cartItems"
            WHERE "cartId" = (
              SELECT id
              FROM carts
              WHERE "userId" = $1
            );
            `,
      values: [userId],
    });

    const order = await db.query({
      text: `
            SELECT 
              id, 
              "userId", 
              status, 
              total, 
              "shippingAddress", 
              "shippingNote", 
              "createdAt"
            FROM "orderDetails"
            WHERE id = $1;
            `,
      values: [orderId],
    });

    const orderItems = await db.query({
      text: `
            SELECT 
              "orderItems".id AS "orderItemId", 
              "productId", 
              "imgUrlLarge",
              "name", 
              "orderItems".quantity,
              price
            FROM "orderItems"
            INNER JOIN products ON "orderItems"."productId" = products.id
            WHERE "orderId" = $1;
            `,
      values: [orderId],
    });

    order.rows[0].orderItems = orderItems.rows;

    res
      .status(200)
      .json({ msg: 'Order placed successfully.', order: order.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const test = async (req, res) => {
  try {
    const result = await db.query({
      text: `
            SELECT "productId", quantity
            FROM "cartItems"
            WHERE "cartId" = $1;
            `,
      values: [2],
    });

    result.rows.forEach((row) => {
      const { productId, quantity } = row;

      console.log(`Product ID: ${productId}, Quantity: ${quantity}`);
    });

    // console.log(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};
