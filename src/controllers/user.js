import { UserModel } from '../models/user';

// TODO permission checking after auth implementation
/**
 * Get user.
 *
 * @param req {Object} Request object
 * @param res {Object} Response object
 * @param next {function} Callback to the next handler
 */
function getUser (req, res, next) {
  const { userId } = req.params;

  UserModel.findById(userId, (err, user) => {
    if (err) {
      res.status(400)
        .json({ error: 'User is not found.' });
      return next(err);
    }

    return res.status(200)
      .json({ user });
  });
}

/**
 * Update user.
 *
 * @param req {Object} The request object
 * @param res {Object} The response object
 * @param next {function} The callback to the next handler
 */
function updateUser (req, res, next) {
  const { userId } = req.params;
  const data = req.body;

  if (Object.keys(data).length === 0 || typeof data !== 'object') {
    console.error('No input data.');
  }

  UserModel.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }, (err, user) => {
    if (err) {
      res.status(400)
        .json({ error: 'User is not found.' });
      return next(err);
    }

    return res.status(200)
      .json({ user });
  });
}

/**
 * Delete user.
 *
 * @param req {Object} The request object
 * @param res {Object} The response object
 * @param next {function} The callback to the next handler
 */
function deleteUser (req, res, next) {
  const { userId } = req.params;

  UserModel.findByIdAndDelete(userId, (err) => {
    if (err) {
      res.status(400)
        .json({ error: 'User is not found.' });
      return next(err);
    }

    return res.status(200)
      .json({ message: 'User is deleted.' });
  });
}

/**
 * Get all users.
 *
 * @param req {Object} The request object
 * @param res {Object} The response object
 * @param next {function} The callback to the next handler
 */
function getAllUsers (req, res, next) {
  UserModel.find({}, (err, users) => {
    if (err) {
      res.status(400)
        .json({ error: 'Users are not found.' });
      return next(err);
    }

    return res.status(200)
      .json({ users });
  });
}

export default {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
