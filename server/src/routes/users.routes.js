import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile, updateProfile, logout } from '../controllers/users.controller.js';

const router = Router();
router.get('/me', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);
router.post('/logout', requireAuth, logout);

export default router;
