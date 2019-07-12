import { validationResult } from 'express-validator';
import AuthService from '../services/auth';

async function registration (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const { user, token } = await AuthService.registration(email, password);
    return res.status(200)
      .json({ user, token });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

async function login (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const { user, token } = await AuthService.login(email, password);
    return res.status(200)
      .json({ user, token });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

async function resetUserPassword (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({ errors: errors.array() });
  }

  const { password } = req.body;

  try {
    await AuthService.resetUserPassword(req.currentUser._id, password);
    return res.status(200)
      .json({ message: 'Password is reset.' });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

export default {
  registration,
  login,
  resetUserPassword,
};
