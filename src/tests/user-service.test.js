import { assert } from 'chai';
import config from '../config';
import UserService from '../services/user';
import { UserModel } from '../models/user';
import { connectToDatabase } from '../database';

let connection;
let user;
let userId;

setup(async () => {
  connection = await connectToDatabase(config.db.TEST);
  await connection.dropDatabase();

  user = await UserModel.create({
    email: 'testuser@gmail.com',
    password: 'password',
  });
  userId = user._id;
});

teardown(async () => {
  await connection.close();
});

suite('User Service', () => {
  suite('positive tests', () => {
    test('#getUser()', async () => {
      const foundUser = await UserService.getUser(userId);
      assert.equal(foundUser.email, user.email, 'found user equal to user');
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
      const users = await UserModel.find({})
        .countDocuments()
        .exec();

      assert.equal(deletedUser.email, user.email, 'deleted user email equal to user email');
      assert.equal(users, 0, 'number of users equal to 0');
    });

    test('#getAllUsers()', async () => {
      const foundUsers = await UserService.getAllUsers();
      const users = await UserModel.find({})
        .exec();

      assert.equal(foundUsers.length, users.length, 'number of found users equal to number of users');
    });
  });
});
