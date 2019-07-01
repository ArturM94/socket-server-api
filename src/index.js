import express from 'express';
import http from 'http';
import io from 'socket.io';
import config from './config';
import { socketEvents } from './socketEvents';
import apiRouter from './routes/api';
import { connectToDatabase } from './database';

const app = express();

try {
  connectToDatabase();
} catch (e) {
  console.error('Something wrong with db connection...\n', e.message);
}

const httpServer = http.createServer(app);

const { HOST, PORT } = config;

const server = httpServer.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening on ${HOST}:${PORT}`);
});

const socket = io.listen(server);
socketEvents(socket);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);
