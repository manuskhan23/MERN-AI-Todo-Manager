import express from 'express';
import rateLimit from 'express-rate-limit';
import { getChats, createChat, renameChat, deleteChat, getMessages, sendMessage } from '../controllers/aiController.js';
import { protect, syncUser } from '../middlewares/authMiddleware.js';

const limiter = rateLimit({ windowMs: 60000, max: 10 }); // 10 requests per minute
const router = express.Router();

router.route('/chats').get(protect, syncUser, getChats).post(protect, syncUser, createChat);
router.route('/chats/:id').put(protect, syncUser, renameChat).delete(protect, syncUser, deleteChat);
router.route('/chats/:id/messages').get(protect, syncUser, getMessages).post(protect, syncUser, limiter, sendMessage);

export default router;