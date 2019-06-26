import express from 'express';
import http from 'http';
import io from 'socket.io';

import { socketEvents } from './socketEvents';


const app = express();
const httpServer = http.createServer(app);

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '3000';

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
