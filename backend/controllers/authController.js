import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../services/database.js';

const SECRET = process.env.SECRET;
const maxAge = 60 * 60; // 1h
// const maxAge = 60 * 10; // 10m

// export const authentication = (req, res) => {
//   const {  } = req.
// }

export const verifyToken = async (req, res) => {
  const token = req.cookies.token;
  // console.log('req.cookies.token', req.cookies.token);

  if (!token) {
    console.log('NO token provided, authorization denided.');

    return res
      .status(401)
      .json({ msg: 'No token provided, authorization denided.' });
  }

  console.log('token:', token);

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log('user in token:', decoded.user);

    const result = await db.query({
      text: `
            SELECT id, "imgUrl", "firstName", "lastName", email, "isAdmin" FROM users
            WHERE id=$1;
            `,
      values: [decoded.user.id],
    });

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.log('error', error);
    res.status(401).json({ msg: 'Invalid token, authorization denied.' });
  }
};

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('hashedPassword', hashedPassword);

    const result = await db.query({
      text: `
          INSERT INTO public.users("firstName", "lastName", email, password)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT DO NOTHING
          RETURNING id, "imgUrl", "firstName", "lastName", email, "isAdmin";
          `,
      values: [firstName, lastName, email, hashedPassword],
    });

    if (result.rows.length === 0) {
      return res
        .status(490)
        .json({ msg: 'Email has already registered. Please try new one.' });
    }

    const user = result.rows[0];
    const token = jwt.sign({ user }, SECRET, { expiresIn: maxAge });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ msg: 'Registration successful!', user });
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: 'Registration failed.', error });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await db.query({
      text: `
          SELECT id, password FROM users
          WHERE email=$1;
          `,
      values: [email],
    });

    if (checkEmail.rows.length === 0) {
      return res.status(404).json({ msg: 'Invalid email or password.' });
    }

    const { id, password: hashedPassword } = checkEmail.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      return res.status(404).json({ msg: 'Invalid email or password.' });
    }

    const result = await db.query({
      text: `
            SELECT id, "imgUrl", "firstName", "lastName", email, "isAdmin" FROM users
            WHERE id=$1;
            `,
      values: [id],
    });

    const user = result.rows[0];

    const token = jwt.sign({ user }, SECRET, { expiresIn: maxAge });

    res.cookie('token', token, {
      httpOnly: true,
      // sameSite: 'none',
      maxAge: maxAge * 1000,
    });

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
};

export const signOut = (req, res) => {
  // console.log(req.cookies);

  res.clearCookie('token');

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  res.end();
};
