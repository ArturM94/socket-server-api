import express from 'express';
import UserController from '../controllers/user';
import isAuth from '../middlewares/isAuth';
import attachCurrentUser from '../middlewares/attachCurrentUser';

const userRouter = express.Router();
const authMiddlewares = [isAuth, attachCurrentUser];

userRouter.route('/')
  .get(authMiddlewares, UserController.getAllUsers);

userRouter.route('/:userId')
  .get(authMiddlewares, UserController.getUser)
  .put(authMiddlewares, UserController.updateUser)
  .delete(authMiddlewares, UserController.deleteUser);

export default userRouter;
