import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user';
import config from '../config';

/**
 * Registers new user.
 *
 * @param email {string} User email
 * @param password {string} User password
 * @returns {Promise<{user: Object, token: string}>} Registered user and its token
 */
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

/**
 * Authenticates user.
 *
 * @param email {string} User email
 * @param password {string} User password
 * @returns {Promise<{user: Object, token: string}>} Logged in user and its token
 */
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

/**
 * Generates JWT.
 *
 * @param user {Object} Registered user
 * @returns {string} Signed JWT
 */
function generateToken (user) {
  const data = {
    _id: user._id,
    email: user.email,
  };
  const secret = config.auth.JWT_SECRET;
  const expiration = config.auth.JWT_EXPIRATION;
  return jwt.sign({ data }, secret, { expiresIn: expiration });
}

/**
 * Removes password field from returning user object.
 *
 * @param registeredUser {Object} Registered user
 * @returns {Promise<Object>} User without password field
 */
async function removePasswordField (registeredUser) {
  const user = await registeredUser.toObject();
  await delete user.password;

  return user;
}

/**
 * Resets user password.
 *
 * @param userId {string} User id
 * @param newPassword {string} User password
 * @returns {Promise<void>}
 */
async function resetUserPassword (userId, newPassword) {
  const hashedPassword = await argon2.hash(newPassword);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });
}

export default {
  registration,
  login,
  generateToken,
  resetUserPassword,
};
