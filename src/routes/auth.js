import express from 'express';
import AuthController from '../controllers/auth';

const authRouter = express.Router();

authRouter.route('/registration')
  .post(AuthController.registration);

authRouter.route('/login')
  .post(AuthController.login);

authRouter.route('/logout')
  .post(// TODO Invoke AuthController.logout
  );

authRouter.route('/reset-user-password')
  .post(// TODO Invoke AuthController.resetUserPassword
  );

export default authRouter;
