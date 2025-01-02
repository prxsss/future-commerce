import express from 'express';

import * as authController from '../controllers/authController.js';

const router = express.Router();

router.get('/signout', authController.signOut);
router.get('/verify-token', authController.verifyToken);
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

export default router;
