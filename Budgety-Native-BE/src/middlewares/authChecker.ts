import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: 'You are not authorized' });
    return;
  }

  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
    };

    const user = await User.findOne({ _id }).select('_id');

    if (user) {
      req.userId = user._id;
      next();
    } else {
      res.status(401).json({ error: 'You are not authorized' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ error: 'You are not authorized' });
    }
  }
};
