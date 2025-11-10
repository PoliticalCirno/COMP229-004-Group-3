// src/controllers/chat.controller.js
import { chatRespond } from '../utils/ai.js';

export const chat = async (req, res, next) => {
  try {
    const { message, history } = req.body || {};
    if (!message) return res.status(400).json({ message: 'message is required' });
    const answer = await chatRespond(message, Array.isArray(history) ? history : []);
    res.json({ reply: answer });
  } catch (e) { next(e); }
};
