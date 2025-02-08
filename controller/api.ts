import { NextFunction, Request, Response } from 'express';
import { db } from '../config/firebaseConfig';
import { User } from '../interfaces/user.interface';

export const updateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.uid;
    const userData: Partial<User> = req.body;

    // Validate required fields
    if (!userData || Object.keys(userData).length === 0) {
      res.status(400).json({ error: 'No data provided for update' });
      return;
    }

    const userRef = db.collection('USERS').doc(userId);

    await userRef.update({
      ...userData,
      updatedAt: new Date()
    });

    res.status(200).json({ message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ error: 'Failed to update user data' });
  }
};

export const fetchUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.uid;
    const userRef = db.collection('USERS').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userData = userDoc.data() as User;
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};
