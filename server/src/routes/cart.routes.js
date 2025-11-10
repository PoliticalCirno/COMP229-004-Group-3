import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.controller.js';

const router = Router();
router.get('/', requireAuth, getCart);
router.post('/add', requireAuth, addToCart);
router.put('/update', requireAuth, updateCartItem);
router.delete('/remove', requireAuth, removeFromCart);
router.delete('/clear', requireAuth, clearCart);

export default router;
