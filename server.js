const express = require('express');
const app = express();
const server = require('http').Server(app);
const socketIo = require('socket.io')(server);
const path = require('path');
const { CONSTANTS } = require('./utils/constants');
const { getUser, getUsers, getUserBySocketId, getLeftUser } = require('./utils/user');
const { formatMsg } = require('./utils/messag');
app.use(express.static(path.join(__dirname, '/public'))); // use static files
socketIo.on('connection', (socket) => {
  // when a client connects
  socket.on(CONSTANTS.JOIN_ROOM, ({ userName, roomName }) => {
    const user = getUser({ userName, roomName, socketId: socket.id });
    socket.join(user.roomName);
    socket.emit(CONSTANTS.MESSAGE, formatMsg({ userName: CONSTANTS.BOT, text: `welcome to ${user.roomName}` }));
    socket.broadcast.to(user.roomName).emit(CONSTANTS.USER_JOIN, formatMsg({ userName: CONSTANTS.BOT, text: `${user.userName} join ${user.roomName}` }));

    socketIo.to(user.roomName).emit(CONSTANTS.ROOM_NAME_AND_USERS, { roomName: user.roomName, roomUsers: getUsers(user.roomName) });
  });

  socket.on(CONSTANTS.SEND_MSG, (msg) => {
    const user = getUserBySocketId(socket.id);
    socketIo.to(user.roomName).emit(CONSTANTS.MESSAGE, formatMsg({ userName: user.userName, text: msg }));
  });

  socket.on('disconnect', () => {
    const user = getLeftUser(socket.id);
    if (user != null) {
      socketIo.to(user.roomName).emit(CONSTANTS.MESSAGE, formatMsg({ userName: CONSTANTS.BOT, text: `${user.userName} left the room` }));
      socketIo.to(user.roomName).emit(CONSTANTS.ROOM_NAME_AND_USERS, { roomName: user.roomName, roomUsers: getUsers(user.roomName) });
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  // listen on port 3000
  console.log(`Server is running on port http://localhost:${PORT}`);
});
