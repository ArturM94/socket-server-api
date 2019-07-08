import express from 'express';
import ChatController from '../controllers/chat';
import isAuth from '../middlewares/isAuth';
import attachCurrentUser from '../middlewares/attachCurrentUser';

const chatRouter = express.Router();
const authMiddlewares = [isAuth, attachCurrentUser];

chatRouter.route('/')
  .get(authMiddlewares, ChatController.getAllUserChats);

chatRouter.route('/:chatId')
  .get(authMiddlewares, ChatController.getChat)
  .post(authMiddlewares, ChatController.sendMessage)
  .put(authMiddlewares, ChatController.leaveChat)
  .delete(authMiddlewares, ChatController.deleteChat);

chatRouter.route('/join/:chatId')
  .put(authMiddlewares, ChatController.joinChat);

chatRouter.route('/new/:receiverId')
  .post(authMiddlewares, ChatController.createChat);

export default chatRouter;
