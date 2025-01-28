import db from '../services/database.js';

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      console.log('No userId provided.');
      return res.status(400).json({ msg: 'No userId provided.' });
    }

    const result = await db.query({
      text: `
        SELECT  
          od.id AS "orderId",
          od."userId",
          CONCAT(u."firstName", ' ', u."lastName") AS "userFullName",
          od."shippingAddress",
          od.total,
          od."createdAt",
          json_agg(
            json_build_object(
              'orderItemId', oi.id,
              'productId', p.id,
              'imgUrlLarge', p."imgUrlLarge",
              'imgUrlSmall', p."imgUrlSmall",
              'name', p.name,
              'description', p.description,
              'price', p.price,
              'quantity', oi.quantity
            ) 
          ) AS "orderItems"
        FROM 
          "orderDetails" od
        JOIN
          "orderItems" oi ON od.id = oi."orderId"
        JOIN
          users u ON od."userId" = u.id
        JOIN
          "products" p ON oi."productId" = p.id
        WHERE od."userId" = $1
        GROUP BY od.id, od."userId", u."firstName", u."lastName", od."shippingAddress", od.total, od."createdAt"
        ORDER BY od."createdAt" DESC;
      `,
      values: [userId],
    });

    res.status(200).json({ orders: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const result = await db.query({
      text: `
        SELECT  
          od.id AS "orderId",
          od."userId",
          CONCAT(u."firstName", ' ', u."lastName") AS "userFullName",
          od."shippingAddress",
          od.total,
          od."createdAt",
          od.status,
          json_agg(
            json_build_object(
              'orderItemId', oi.id,
              'productId', p.id,
              'imgUrlLarge', p."imgUrlLarge",
              'imgUrlSmall', p."imgUrlSmall",
              'name', p.name,
              'description', p.description,
              'price', p.price,
              'quantity', oi.quantity
            ) 
          ) AS "orderItems"
        FROM 
          "orderDetails" od
        JOIN
          "orderItems" oi ON od.id = oi."orderId"
        JOIN
          "products" p ON oi."productId" = p.id
        JOIN
          "users" u ON od."userId" = u.id
        GROUP BY od.id, od."userId", u."firstName", u."lastName", od."shippingAddress", od.total, od."createdAt"
        ORDER BY od."createdAt" DESC;
      `,
    });

    res.status(200).json({ orders: result.rows });
  } catch (error) {
    console.log('getOrders', error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      console.log('No id provided.');
      return res.status(400).json({ msg: 'No id provided.' });
    }

    const parsedId = parseInt(id);

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
      values: [parsedId],
    });

    if (order.rows.length === 0) {
      console.log('Order not found.');
      return res.status(404).json({ msg: 'Order not found.' });
    }

    const orderItems = await db.query({
      text: `
            SELECT 
              "orderItems".id AS "orderItemId", 
              "productId", 
              "imgUrlSmall",
              "name", 
              "orderItems".quantity,
              price
            FROM "orderItems"
            INNER JOIN products ON "orderItems"."productId" = products.id
            WHERE "orderId" = $1;
            `,
      values: [parsedId],
    });

    if (orderItems.rows.length === 0) {
      console.log('Order items not found.');
      return res.status(404).json({ msg: 'Order items not found.' });
    }

    order.rows[0].orderItems = orderItems.rows;

    console.log(order.rows[0]);
    res.status(200).json({ order: order.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

export const testOrder = async (req, res) => {
  try {
    const result = await db.query({
      text: `
        SELECT json_agg(json_build_object('name', name, 'description', description, 'price', price)) AS json_products FROM products;
      `,
    });

    res.status(200).json({ order: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};
