import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import db from './services/database.js';

import usersRoute from './routes/usersRoute.js';
import authRoute from './routes/authRoute.js';
import productsRoute from './routes/productsRoute.js';
import cartsRoute from './routes/cartsRoute.js';
import ordersRoute from './routes/ordersRoute.js';
import testsRoute from './routes/TestsRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://16e1-223-24-158-211.ngrok-free.app',
      'http://172.20.10.9:5173/',
    ],
  })
);
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/static', express.static('./public'));
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/tests', testsRoute);

app.get('/', async (req, res) => {
  const result = await db.query('SELECT NOW();');

  res.json({ msg: result.rows[0] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
