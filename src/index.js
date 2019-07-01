import express from 'express';
import apiRouter from './routes/api';
import { connectToDatabase } from './database';
import { startAppServer, startSocketServer } from './servers';

const app = express();

try {
  connectToDatabase();
} catch (e) {
  console.error('Something wrong with db connection...\n', e.message);
}

try {
  const server = startAppServer(app);
  startSocketServer(server);
} catch (e) {
  console.error('Something wrong with server...\n', e.message);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);
