import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const createToken = (id: string) => jwt.sign({ id }, process.env.JWT_SECRET!);

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
