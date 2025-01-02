import express from 'express';

import * as usersController from '../controllers/usersController.js';

const router = express.Router();

router.get('/', usersController.getUsers);
router.patch('/:id', usersController.updateUser);

export default router;
