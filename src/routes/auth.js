import express from 'express';
import AuthController from '../controllers/auth';
import {
  EmailValidator,
  PasswordValidator,
} from '../middlewares/validators';
import isAuth from '../middlewares/isAuth';
import attachCurrentUser from '../middlewares/attachCurrentUser';

const authRouter = express.Router();
const emailValidator = EmailValidator();
const passwordValidator = PasswordValidator();
const authMiddlewares = [isAuth, attachCurrentUser];

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
  .post(
    passwordValidator,
    authMiddlewares,
    AuthController.resetUserPassword
  );

export default authRouter;
