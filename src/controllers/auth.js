import AuthService from '../services/auth';

async function registration (req, res) {
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

export default {
  registration,
  login,
};
