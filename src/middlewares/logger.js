import fs from 'fs';
import rfs from 'rotating-file-stream';
import path from 'path';
import morgan from 'morgan';
import config from '../config';

const logDirectory = path.join(__dirname, '../logs');

// eslint-disable-next-line no-unused-expressions
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs(fileName, {
  interval: config.logger.INTERVAL,
  path: logDirectory,
});

const stream = morgan(config.logger.STREAM_FORMAT, { stream: accessLogStream });
const log = morgan(config.logger.FORMAT);

function pad (num) {
  return (num > 9 ? '' : '0') + num;
}

function fileName (time, index) {
  if (!time) {
    return 'access.log';
  }

  const month = `${time.getFullYear()}${pad(time.getMonth() + 1)}`;
  const day = pad(time.getDate());
  const hour = pad(time.getHours());
  const minute = pad(time.getMinutes());

  return `${month}/${month}${day}-${hour}${minute}-${index}-access.log`;
}

export default {
  stream,
  log,
};
