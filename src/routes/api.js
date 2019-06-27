import express from 'express';
import authRouter from './auth';
import userRouter from './user';
import chatRouter from './chat';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/chats', chatRouter);

export default apiRouter;
