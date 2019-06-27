import express from 'express';

const authRouter = express.Router();

authRouter.route('/registration')
  .post(// TODO Invoke AuthController.registration
  );

authRouter.route('/login')
  .post(// TODO Invoke AuthController.login
  );

authRouter.route('/logout')
  .post(// TODO Invoke AuthController.logout
  );

authRouter.route('/reset-user-password')
  .post(// TODO Invoke AuthController.resetUserPassword
  );

export default authRouter;
