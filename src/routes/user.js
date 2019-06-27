import express from 'express';
import UserController from '../controllers/user';

const userRouter = express.Router();

userRouter.route('/')
  .get(UserController.getAllUsers);

userRouter.route('/:userId')
  .get(UserController.getUser)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

export default userRouter;
