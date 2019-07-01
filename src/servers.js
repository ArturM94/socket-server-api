import http from 'http';
import io from 'socket.io';
import config from './config';
import { socketEvents } from './socketEvents';

/**
 * Starts up application server.
 *
 * @param app {Express} Express application
 * @returns {Server} Http server
 */
async function startAppServer (app) {
  const httpServer = await http.createServer(app);
  const server = await httpServer.listen(config.PORT);

  console.log(`http server listening on ${config.HOST}:${config.PORT}`);

  return server;
}

/**
 * Starts up socket server.
 *
 * @param server {Server} Http server
 * @returns {Promise<void>}
 */
async function startSocketServer (server) {
  const socket = await io.listen(server);
  await socketEvents(socket);

  console.log(`socket server listening on ${config.HOST}:${config.PORT}`);
}

export {
  startAppServer,
  startSocketServer,
};
