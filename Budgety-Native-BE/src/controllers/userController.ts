import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import FinanceModel from '../models/financeModel';
import User from '../models/userModel';

const createToken = (id: string) => jwt.sign({ id }, process.env.JWT_SECRET!);

export const handleDeleteUser = async (req: Request, res: Response) => {
  const { userId } = req;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const financeDoc = await FinanceModel.findOneAndDelete({ userId: userId });
    const userDoc = await User.findOneAndDelete({ _id: userId });

    if (!financeDoc || !userDoc)
      return res.status(404).json({ error: 'Data not found' });

    return res.status(200).json({ message: 'User deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const JWTtoken = createToken(user._id);

    res.status(200).json({ user, token: JWTtoken });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const signupUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    const user = await User.signup(email, password, username);

    const JWTtoken = createToken(user._id);

    res.status(200).json({ user, token: JWTtoken });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const updateCurrency = async (req: Request, res: Response) => {
  const { userId } = req;
  const { currency } = req.body;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const userDoc = await User.findOneAndUpdate(
      { _id: userId },
      { currency: currency },
      { new: true }
    );

    if (!userDoc) return res.status(404).json({ error: 'Data not found' });

    return res.status(200).json({ currency: userDoc.currency });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const updateLanguage = async (req: Request, res: Response) => {
  const { userId } = req;
  const { language } = req.body;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const userDoc = await User.findOneAndUpdate(
      { _id: userId },
      { language: language },
      { new: true }
    );

    if (!userDoc) return res.status(404).json({ error: 'Data not found' });

    return res.status(200).json({ language: userDoc.language });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export const updateUsername = async (req: Request, res: Response) => {
  const { userId } = req;
  const { username } = req.body;

  if (!userId) return res.status(401).json({ error: 'You are not authorized' });

  try {
    const userDoc = await User.findOneAndUpdate(
      { _id: userId },
      { username: username },
      { new: true }
    );

    if (!userDoc) return res.status(404).json({ error: 'Data not found' });

    return res.status(200).json({ username: userDoc.username });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
