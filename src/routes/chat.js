import express from 'express';
import ChatController from '../controllers/chat';
import isAuth from '../middlewares/isAuth';
import attachCurrentUser from '../middlewares/attachCurrentUser';
import {
  MongoIdValidator,
  MessageBodyValidator,
} from '../middlewares/validators';

const chatRouter = express.Router();
const authMiddlewares = [isAuth, attachCurrentUser];
const messageBodyValidator = MessageBodyValidator();

chatRouter.route('/')
  .get(
    authMiddlewares,
    ChatController.getAllUserChats
  );

chatRouter.route('/:chatId')
  .get(
    authMiddlewares,
    MongoIdValidator('chatId'),
    ChatController.getChat
  )
  .post(
    authMiddlewares,
    MongoIdValidator('chatId'),
    messageBodyValidator,
    ChatController.sendMessage
  )
  .put(
    authMiddlewares,
    MongoIdValidator('chatId'),
    ChatController.leaveChat
  )
  .delete(
    authMiddlewares,
    MongoIdValidator('chatId'),
    ChatController.deleteChat
  );

chatRouter.route('/join/:chatId')
  .put(
    authMiddlewares,
    MongoIdValidator('chatId'),
    ChatController.joinChat
  );

chatRouter.route('/new/:receiverId')
  .post(
    authMiddlewares,
    MongoIdValidator('receiverId'),
    messageBodyValidator,
    ChatController.createChat
  );

export default chatRouter;
