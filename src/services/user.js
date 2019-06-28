import { UserModel } from '../models/user';

async function getUser (userId) {
  return UserModel.findById(userId);
}

async function updateUser (userId, data) {
  return UserModel.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });
}

async function deleteUser (userId) {
  return UserModel.findByIdAndDelete(userId);
}

async function getAllUsers () {
  return UserModel.find({});
}

export default {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
