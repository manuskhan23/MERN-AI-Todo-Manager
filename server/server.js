import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// This middleware adds auth information to the request object
app.use(clerkMiddleware());

app.use('/api/auth', authRoutes); // Note: Routes here are now protected
app.use('/api/sections', sectionRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => res.send('API Running'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));