import UserService from '../services/user';

// TODO permission checking after auth implementation
/**
 * Get user by id.
 *
 * @param req {Object} Request object
 * @param res {Object} Response object
 * @returns {Promise<Response>}
 */
async function getUserById (req, res) {
  const { userId } = req.params;

  try {
    const user = await UserService.getUser(userId);
    return res.status(200)
      .json({ user });
  } catch (e) {
    console.log(e);
    return res.status(500)
      .json({ error: e.message });
  }
}

/**
 * Get user.
 *
 * @param req {Object} Request object
 * @param res {Object} Response object
 * @returns {Promise<Response>}
 */
async function getUser (req, res) {
  try {
    const user = await UserService.getUser(req.currentUser._id);
    return res.status(200)
      .json({ user });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

/**
 * Update user.
 *
 * @param req {Object} The request object
 * @param res {Object} The response object
 * @returns {Promise<Response>} User, otherwise error message
 */
async function updateUser (req, res) {
  const data = req.body;

  const dataIsInvalid = !data || data.constructor !== Object || Object.keys(data).length === 0;
  if (dataIsInvalid) {
    return res.status(400)
      .json({ error: 'No input data.' });
  }

  // TODO add data validation

  try {
    const user = await UserService.updateUser(req.currentUser._id, data);
    return res.status(200)
      .json({ user });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

/**
 * Delete user.
 *
 * @param req {Object} The request object
 * @param res {Object} The response object
 * @returns {Promise<Response>} Success message, otherwise error message
 */
async function deleteUser (req, res) {
  try {
    await UserService.deleteUser(req.currentUser._id);
    return res.status(200)
      .json({ message: 'User is deleted.' });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

/**
 * Get all users.
 *
 * @param req {Object} The request object
 * @param res {Object} The response object
 * @returns {Promise<Response>} Users, otherwise error message
 */
async function getAllUsers (req, res) {
  try {
    const users = await UserService.getAllUsers();
    return res.status(200)
      .json({ users });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

export default {
  getUserById,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
