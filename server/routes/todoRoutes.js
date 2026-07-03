import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo, updateTodoStatus } from '../controllers/todoController.js';
import { protect, syncUser } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.route('/').get(protect, syncUser, getTodos).post(protect, syncUser, createTodo);
router.route('/:id').put(protect, syncUser, updateTodo).delete(protect, syncUser, deleteTodo);
router.route('/:id/status').patch(protect, syncUser, updateTodoStatus);
export default router;