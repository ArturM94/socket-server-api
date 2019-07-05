import { User } from '../models/user';

async function getUser (userId) {
  return User.findById(userId);
}

async function updateUser (userId, data) {
  return User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });
}

async function deleteUser (userId) {
  return User.findByIdAndDelete(userId);
}

async function getAllUsers () {
  return User.find({});
}

export default {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
