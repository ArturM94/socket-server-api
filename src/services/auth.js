import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';
import config from '../config';

async function registration (email, password) {
  const hashedPassword = await argon2.hash(password);
  const user = await UserModel.create({
    email,
    password: hashedPassword,
  });
  const token = generateToken(user);
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
  const token = generateToken(user);
  return { user, token };
}

function generateToken (user) {
  const data = {
    _id: user._id,
    email: user.email,
  };
  const secret = config.auth.JWT_SECRET;
  const expiration = config.auth.JWT_EXPIRATION;
  return jwt.sign({ data }, secret, { expiresIn: expiration });
}

export default {
  registration,
  login,
};
