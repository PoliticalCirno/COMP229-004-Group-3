// src/routes/chat.routes.js
import { Router } from 'express';
import { chat } from '../controllers/chat.controller.js';
// If you want only logged-in users to chat, import requireAuth and wrap the route.
const router = Router();
router.post('/', chat);
export default router;
