import { UserModel } from '../models/user';

async function attachCurrentUser (req, res, next) {
  try {
    const userData = req.token;
    const user = await UserModel.findOne({ _id: userData._id });
    if (!user) {
      return res.status(401)
        .json({ error: 'Not authorized.' });
    }
    req.currentUser = user;
    return next();
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

export default attachCurrentUser;
