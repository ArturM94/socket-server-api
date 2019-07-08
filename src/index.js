import express from 'express';
import apiRouter from './routes/api';
import { connectToDatabase } from './database';
import { startAppServer, startSocketServer } from './servers';
import config from './config';
import logger from './middlewares/logger';

const app = express();
const { URI } = config.db;

try {
  (async () => {
    await connectToDatabase(URI);
    console.log(`connected to ${URI}`);
    const server = await startAppServer(app);
    await startSocketServer(server);
  })();
} catch (e) {
  console.error('Something wrong with run of app...\n', e.message);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger.stream);
app.use(logger.log);
app.use('/api', apiRouter);
