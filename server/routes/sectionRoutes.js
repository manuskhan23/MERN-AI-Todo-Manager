import express from 'express';
import { getSections, createSection, updateSection, deleteSection } from '../controllers/sectionController.js';
import { protect, syncUser } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.route('/').get(protect, syncUser, getSections).post(protect, syncUser, createSection);
router.route('/:id').put(protect, syncUser, updateSection).delete(protect, syncUser, deleteSection);
export default router;