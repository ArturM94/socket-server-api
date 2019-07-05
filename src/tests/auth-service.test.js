import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose from 'mongoose';
import * as argon2 from 'argon2';
import { connectToDatabase } from '../database';
import config from '../config';
import { UserModel } from '../models/user';
import AuthService from '../services/auth';

chai.use(chaiAsPromised);

let mockUser;
let email;
let password;
let hashedPassword;

connectToDatabase(config.db.TEST);

setup(async () => {
  await mongoose.connection.dropDatabase();

  email = 'testuser@gmail.com';
  password = 'password';
  hashedPassword = await argon2.hash(password);
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
      mockUser = await UserModel.create({
        email,
        password: hashedPassword,
      });

      const { user, token } = await AuthService.login(mockUser.email, password);
      const generatedToken = await AuthService.generateToken(user);

      assert.equal(mockUser.email, user.email, 'mock-user email equal to putted email');
      assert.equal(generatedToken, token, 'mock-user token equal to generated token');
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
      mockUser = await UserModel.create({
        email,
        password: hashedIncorrectPassword,
      });

      const loginWithIncorrectPassword = AuthService.login(mockUser.email, incorrectPassword);

      return expect(loginWithIncorrectPassword).to.eventually
        .be.rejectedWith(Error, 'Password is incorrect.', 'login with incorrect password');
    });
  });
});
