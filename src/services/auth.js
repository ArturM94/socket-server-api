import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user';
import config from '../config';

async function registration (email, password) {
  const hashedPassword = await argon2.hash(password);
  const registeredUser = await User.create({
    email,
    password: hashedPassword,
  });
  const token = generateToken(registeredUser);
  const user = await removePasswordField(registeredUser);

  return { user, token };
}

async function login (email, password) {
  const registeredUser = await User.findOne({ email }, '+password');
  if (!registeredUser) {
    throw new Error('User is not found.');
  } else {
    const passwordIsCorrect = await argon2.verify(registeredUser.password, password);
    if (!passwordIsCorrect) {
      throw new Error('Password is incorrect.');
    }
  }
  const token = generateToken(registeredUser);
  const user = await removePasswordField(registeredUser);

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

async function removePasswordField (registeredUser) {
  const user = await registeredUser.toObject();
  await delete user.password;

  return user;
}

export default {
  registration,
  login,
  generateToken,
};
