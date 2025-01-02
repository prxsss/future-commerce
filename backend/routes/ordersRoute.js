import express from 'express';

import * as ordersController from '../controllers/ordersController.js';

const router = express.Router();

// router.get('/test', ordersController.testOrder);

router.get('/user/:userId', ordersController.getOrdersByUserId);
router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrderById);

export default router;
