import express from 'express';

const chatRouter = express.Router();

chatRouter.route('/')
  .get(// TODO Invoke ChatController.getAllUserChats
  );

chatRouter.route('/:chatId')
  .get(// TODO Invoke ChatController.getChat
  )
  .post(// TODO Invoke ChatController.sendMessage
  )
  .put(// TODO Invoke ChatController.leaveFromChat
  )
  .delete(// TODO Invoke ChatController.deleteChat
  );

chatRouter.route('/new/:receiverId')
  .post(// TODO Invoke ChatController.createChat
  );

export default chatRouter;
