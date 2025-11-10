import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createOrUpdateReview, listProductReviews } from '../controllers/reviews.controller.js';

const router = Router();

router.get('/product/:productId', listProductReviews);
router.post('/', requireAuth, createOrUpdateReview);

export default router;
