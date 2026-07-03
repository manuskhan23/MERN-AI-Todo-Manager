import User from '../models/User.js';
import { getAuth } from '@clerk/express';

// Called by frontend to ensure user is in DB after Clerk login
export const syncUserToDB = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const clerkUser = req.body; // Sent from frontend

    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = await User.create({
        clerkId: userId,
        username: clerkUser.username || 'New User',
        email: clerkUser.email,
      });
    } else {
      user.email = clerkUser.email || user.email;
      user.username = clerkUser.username || user.username;
      await user.save();
    }
    res.status(200).json({ message: 'User synced', user });
  } catch (error) {
    res.status(500).json({ message: 'Sync failed' });
  }
};