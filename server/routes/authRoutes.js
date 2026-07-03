import express from 'express';
import { syncUserToDB } from '../controllers/authController.js';
import { protect, syncUser } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.post('/sync', protect, syncUser, syncUserToDB);
export default router;