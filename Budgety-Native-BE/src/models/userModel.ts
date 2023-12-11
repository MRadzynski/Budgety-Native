import bcrypt from 'bcrypt';
import mongoose, { Model } from 'mongoose';
import validator from 'validator';
import defaultFinancesConfig from '../data/defaultFinances.json';
import Finances from './financeModel';

interface IUser {
  _id: string;
  currency: string;
  email: string;
  language: string;
  password: string;
  resetToken?: string;
  resetTokenExpiration?: number;
  username: string;
}

interface UserModel extends Model<IUser> {
  login(email: string, password: string): Promise<IUser>;
  signup(
    email: string,
    password: string,
    username: string,
    currency: string,
    language: string
  ): Promise<IUser>;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>(
  {
    currency: {
      default: 'USD',
      required: true,
      type: String
    },
    email: {
      required: true,
      type: String,
      unique: true
    },
    language: {
      default: 'EN',
      required: true,
      type: String
    },
    password: {
      required: true,
      type: String
    },
    resetToken: {
      type: String
    },
    resetTokenExpiration: {
      type: Number
    },
    username: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.statics.login = async function (email: string, password: string) {
  if (!email?.trim() || !password?.trim())
    throw new Error('All fields must be filled');

  const userDoc = await this.findOne({ email });

  if (!userDoc) throw new Error('Incorrect email');

  const isMatch = await bcrypt.compare(password, userDoc.password);

  if (!isMatch) throw new Error('Incorrect email or password');

  let finalUserDoc = userDoc;

  if (userDoc.resetToken || userDoc.resetTokenExpiration) {
    userDoc.resetToken = undefined;
    userDoc.resetTokenExpiration = undefined;

    const updatedUser = await userDoc.save();

    if (updatedUser) finalUserDoc = updatedUser;
  }

  return finalUserDoc;
};

userSchema.statics.signup = async function (
  email: string,
  password: string,
  username: string,
  currency: string,
  language: string
) {
  if (!email?.trim() || !password?.trim())
    throw new Error('Email and password are required');

  if (!validator.isEmail(email)) throw new Error('Email is not valid');

  if (!validator.isStrongPassword(password))
    throw new Error('Password is not strong enough');

  const userExists = await this.findOne({ email });

  if (userExists) throw new Error('User already exists');

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    currency,
    email,
    language,
    password: hashedPassword,
    username
  });

  await Finances.create({
    userId: user._id,
    ...defaultFinancesConfig
  });

  return user;
};

export default mongoose.model<IUser, UserModel>('User', userSchema);
