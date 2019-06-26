export function socketEvents (io) {
  io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('join conversation', (conversation) => {
      socket.join(conversation);
      console.log(`user joined to conversation ${conversation}`);
    });

    socket.on('leave conversation', (conversation) => {
      socket.leave(conversation);
      console.log(`user left conversation ${conversation}`);
    });

    socket.on('new message', (conversation) => {
      io.sockets.in(conversation)
        .emit('refresh messages', conversation);
    });
  });
}
