import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { AppError } from '../utils/AppError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, msg: 'Register user' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, msg: 'Login user' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, msg: 'Get current user' });
  } catch (err) {
    next(err);
  }
};
