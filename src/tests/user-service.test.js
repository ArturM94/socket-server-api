import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose, { CastError } from 'mongoose';
import * as argon2 from 'argon2';
import UserService from '../services/user';
import { User } from '../models/user';

chai.use(chaiAsPromised);

let mockUser;
let userId;
let invalidUserId;

setup(async () => {
  await mongoose.connection.dropDatabase();

  const password = 'password';
  const hashedPassword = await argon2.hash(password);

  mockUser = await User.create({
    email: 'testuser@gmail.com',
    password: hashedPassword,
  });
  userId = mockUser._id;
  invalidUserId = Math.floor(Math.random() * 100) + 1;
});

suite('User Service', () => {
  suite('positive tests', () => {
    test('#getUser()', async () => {
      const foundUser = await UserService.getUser(userId);

      assert.equal(foundUser.email, mockUser.email, 'found user equal to user');
      assert.isUndefined(foundUser.profile.firstName, 'found user first name is undefined');
      assert.isUndefined(foundUser.profile.lastName, 'found user last name is undefined');
      assert.doesNotHaveAnyKeys(foundUser, ['password'], 'found user does not have "password" key');
    });

    test('#updateUser()', async () => {
      const data = {
        email: 'updated-testuser@gmail.com',
        profile: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      };
      const updatedUser = await UserService.updateUser(userId, data);

      assert.equal(updatedUser.email, data.email, 'updated user email equal to new user email');
      assert.equal(updatedUser.profile.firstName, data.profile.firstName, 'updated user first name equal to new user first name');
      assert.equal(updatedUser.profile.lastName, data.profile.lastName, 'updated user last name equal to new user last name');
    });

    test('#deleteUser()', async () => {
      const deletedUser = await UserService.deleteUser(userId);
      const users = await User.find({})
        .countDocuments()
        .exec();

      assert.equal(deletedUser.email, mockUser.email, 'deleted user email equal to user email');
      assert.equal(users, 0, 'number of users equal to 0');
    });

    test('#getAllUsers()', async () => {
      const foundUsers = await UserService.getAllUsers();
      const users = await User.find({})
        .exec();

      assert.equal(foundUsers.length, users.length, 'number of found users equal to number of users');
    });
  });

  suite('negative tests', () => {
    test('#getUser()', async () => {
      const foundUser = UserService.getUser(invalidUserId);

      return expect(foundUser).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid user id')
        .and.be.an.instanceOf(Error);
    });

    test('#updateUser()', async () => {
      const data = {
        email: 'updated-testuser@gmail.com',
        profile: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      };
      const updatedUser = UserService.updateUser(invalidUserId, data);

      return expect(updatedUser).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid user id')
        .and.be.an.instanceOf(Error);
    });

    test('#deleteUser()', async () => {
      const deletedUser = UserService.deleteUser(invalidUserId);

      return expect(deletedUser).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid user id')
        .and.be.an.instanceOf(Error);
    });
  });
});
