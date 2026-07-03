import { requireAuth, getAuth } from '@clerk/express';
import User from '../models/User.js';

// Protects routes and ensures user exists in DB
export const protect = requireAuth();

export const syncUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      // Fetch from Clerk (in real app, you might use Clerk backend SDK to get email/username)
      // For simplicity, we create a basic record
      user = await User.create({ clerkId: userId, username: `user_${userId.substring(0, 5)}`, email: `${userId}@clerk.com` });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};