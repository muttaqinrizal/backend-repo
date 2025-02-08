import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebaseConfig';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken as any;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};