import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose, { CastError } from 'mongoose';
import * as argon2 from 'argon2';
import { connectToDatabase } from '../database';
import config from '../config';
import { User } from '../models/user';
import AuthService from '../services/auth';

chai.use(chaiAsPromised);

let mockUser;
let email;
let password;
let newPassword;
let hashedPassword;
let invalidUserId;
let invalidUserPassword;

connectToDatabase(config.db.TEST);

setup(async () => {
  await mongoose.connection.dropDatabase();

  email = 'testuser@gmail.com';
  password = 'password';
  newPassword = 'newPassword';
  hashedPassword = await argon2.hash(password);

  const randomNumber = () => Math.floor(Math.random() * 100) + 1;
  invalidUserId = randomNumber();
  invalidUserPassword = randomNumber();
});

suite('Auth Service', () => {
  suite('positive tests', () => {
    test('#registration()', async () => {
      const { user, token } = await AuthService.registration(email, password);
      const generatedToken = await AuthService.generateToken(user);

      assert.equal(email, user.email, 'registered user email equal to putted email');
      assert.equal(generatedToken, token, 'user token equal to generated token');
    });

    test('#login()', async () => {
      mockUser = await User.create({
        email,
        password: hashedPassword,
      });

      const { user, token } = await AuthService.login(mockUser.email, password);
      const generatedToken = await AuthService.generateToken(user);

      assert.equal(mockUser.email, user.email, 'mock-user email equal to putted email');
      assert.equal(generatedToken, token, 'mock-user token equal to generated token');
    });

    test('#resetUserPassword()', async () => {
      mockUser = await User.create({
        email,
        password: hashedPassword,
      });

      const { user } = await AuthService.login(mockUser.email, password);
      await AuthService.resetUserPassword(user._id, newPassword);
      const { user: userWithNewPassword } = await AuthService.login(mockUser.email, newPassword);

      assert.equal(user.email, userWithNewPassword.email, 'user email with new password equal to user email');
    });
  });

  suite('negative tests', () => {
    test('#login() - incorrect email', async () => {
      const incorrectEmail = 'incorrect@gmail.com';
      const unregisteredUser = AuthService.login(incorrectEmail, password);

      return expect(unregisteredUser).to.eventually
        .be.rejectedWith(Error, 'User is not found.', 'login with unregistered email');
    });

    test('#login() - incorrect password', async () => {
      const incorrectPassword = 'incorrectPassword';
      const hashedIncorrectPassword = await argon2.hash(incorrectPassword);
      mockUser = await User.create({
        email,
        password: hashedIncorrectPassword,
      });

      const loginWithIncorrectPassword = AuthService.login(mockUser.email, incorrectPassword);

      return expect(loginWithIncorrectPassword).to.eventually
        .be.rejectedWith(Error, 'Password is incorrect.', 'login with incorrect password');
    });

    test('#resetUserPassword() - invalid user id', async () => {
      mockUser = await User.create({
        email,
        password: hashedPassword,
      });

      const resetPassword = AuthService.resetUserPassword(invalidUserId, newPassword);

      return expect(resetPassword).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid user id')
        .and.be.an.instanceOf(Error);
    });

    test('#resetUserPassword() - invalid password', async () => {
      mockUser = await User.create({
        email,
        password: hashedPassword,
      });

      const resetPassword = AuthService.resetUserPassword(mockUser._id, invalidUserPassword);

      return expect(resetPassword).to.eventually
        .be.rejectedWith(TypeError, null, 'get TypeError due invalid password data type')
        .and.be.an.instanceOf(Error);
    });
  });
});
