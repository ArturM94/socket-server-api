import express from 'express';
import UserController from '../controllers/user';
import isAuth from '../middlewares/isAuth';
import attachCurrentUser from '../middlewares/attachCurrentUser';
import { MongoIdValidator } from '../middlewares/validators';

const userRouter = express.Router();
const authMiddlewares = [isAuth, attachCurrentUser];

userRouter.route('/')
  .get(
    authMiddlewares,
    UserController.getAllUsers
  );

userRouter.route('/current')
  .get(
    authMiddlewares,
    UserController.getUser
  )
  .put(
    authMiddlewares,
    UserController.updateUser
  )
  .delete(
    authMiddlewares,
    UserController.deleteUser
  );

userRouter.route('/:userId')
  .get(
    authMiddlewares,
    MongoIdValidator('userId'),
    UserController.getUserById
  );

export default userRouter;
