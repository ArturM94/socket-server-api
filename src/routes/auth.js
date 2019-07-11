import express from 'express';
import AuthController from '../controllers/auth';
import {
  EmailValidator,
  PasswordValidator,
} from '../middlewares/validators';

const authRouter = express.Router();
const emailValidator = EmailValidator();
const passwordValidator = PasswordValidator();

authRouter.route('/registration')
  .post(
    emailValidator,
    passwordValidator,
    AuthController.registration
  );

authRouter.route('/login')
  .post(
    emailValidator,
    AuthController.login
  );

authRouter.route('/logout')
  .post(// TODO Invoke AuthController.logout
  );

authRouter.route('/reset-user-password')
  .post(// TODO Invoke AuthController.resetUserPassword
  );

export default authRouter;
