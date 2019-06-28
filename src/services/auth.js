import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';

async function registration (email, password) {
  const hashedPassword = await argon2.hash(password);
  const user = await UserModel.create({
    email,
    password: hashedPassword,
  });
  const token = this.generateToken(user);
  return { user, token };
}

async function login (email, password) {
  const user = await UserModel.findOne({ email }, '+password');
  if (!user) {
    throw new Error('User is not found.');
  } else {
    const passwordIsCorrect = await argon2.verify(user.password, password);
    if (!passwordIsCorrect) {
      throw new Error('Password is incorrect.');
    }
  }
  const token = this.generateToken(user);
  return { user, token };
}

function generateToken (user) {
  const data = {
    _id: user._id,
    email: user.email,
  };
  const secret = process.env.JWT_SECRET || 'UnS3CuR3_S1Gn@tUr3';
  const expiration = process.env.JWT_EXPIRATION || '24h';
  return jwt.sign({ data }, secret, { expiresIn: expiration });
}

export default {
  registration,
  login,
  generateToken,
};
