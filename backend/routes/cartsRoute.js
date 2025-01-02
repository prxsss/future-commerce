import express from 'express';

import * as cartsController from '../controllers/cartsController.js';

const router = express.Router();

router.get('/:userId', cartsController.getCartByUserId);
router.post('/items', cartsController.addItemToCart);
router.post('/checkout', cartsController.checkout);
router.patch('/items/:cartItemId', cartsController.updateItemInCart);
router.delete('/items/:cartItemId', cartsController.removeItemInCart);
router.delete('/:userId', cartsController.clearCart);

router.get('/test/hello', cartsController.test);

export default router;
