import express from 'express';
import http from 'http';
import io from 'socket.io';
import mongoose from 'mongoose';
import { socketEvents } from './socketEvents';
import apiRouter from './routes/api';

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/socketApiDB';
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
app.use('/api', apiRouter);
