import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { checkout, listMyOrders, getOrder, cancelMyOrder, adminListOrders, adminUpdateStatus } from '../controllers/orders.controller.js';

const router = Router();

router.post('/checkout', requireAuth, checkout);
router.get('/my', requireAuth, listMyOrders);
router.get('/my/:id', requireAuth, getOrder);
router.post('/my/:id/cancel', requireAuth, cancelMyOrder);

router.get('/', requireAuth, requireRole('admin'), adminListOrders);
router.put('/:id/status', requireAuth, requireRole('admin'), adminUpdateStatus);

export default router;
