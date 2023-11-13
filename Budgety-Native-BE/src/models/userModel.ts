import bcrypt from 'bcrypt';
import validator from 'validator';
import mongoose, { Model } from 'mongoose';

interface IUser {
  _id: string;
  currency: string;
  email: string;
  language: string;
  password: string;
  username: string;
}

interface UserModel extends Model<IUser> {
  login(email: string, password: string): Promise<IUser>;
  signup(email: string, password: string, username: string): Promise<IUser>;
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
      type: String,
      required: true
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

  const user = await this.findOne({ email });

  if (!user) throw new Error('Incorrect email');

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error('Incorrect email or password');

  return user;
};

userSchema.statics.signup = async function (
  email: string,
  password: string,
  username: string
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

  const user = await this.create({ email, password: hashedPassword, username });

  return user;
};

export default mongoose.model<IUser, UserModel>('User', userSchema);
