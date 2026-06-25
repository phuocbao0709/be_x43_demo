import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { verifyToken } from '../utils/jwt';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.slice(7);
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const adminGuard = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = verifyToken(authHeader.slice(7));
    req.user = token;

    if (token.role === 'admin') {
      return next();
    }

    const user = await UserModel.findById(token.sub).select('role').lean();
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
