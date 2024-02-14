const express = require('express');
const app = express();
const server = require('http').Server(app);
const socketIo = require('socket.io')(server);
const path = require('path');
const { CONSTANTS } = require('./utils/constants');
const {
  getUser,
  getUsers,
  getUserBySocketId,
  getLeftUser,
} = require('./utils/user');
const { formatMsg } = require('./utils/messag');
app.use(express.static(path.join(__dirname, '/public'))); // use static files

socketIo.on('connection', (socket) => {
  // connection event is built-in event in socket.io and it will be triggered when a client connects to the server and it will pass the socket object to the callback function
  // when a client connects
  socket.on(CONSTANTS.JOIN_ROOM, ({ userName, roomName }) => {
    // listen to the joinRoom event and userName and roomName will receive when the client emits the joinRoom event
    const user = getUser({ userName, roomName, socketId: socket.id }); // add the user to the users array and return the user object
    socket.join(user.roomName); // create a room with the roomName and add the client to the room
    // send a message to the client that he joined the room
    socket.emit(
      CONSTANTS.MESSAGE,
      formatMsg({
        userName: CONSTANTS.BOT,
        text: `welcome to ${user.roomName}`,
      })
    );
    // send a message to all the clients in the room except the client that joined the room
    socket.broadcast.to(user.roomName).emit(
      CONSTANTS.USER_JOIN,
      formatMsg({
        userName: CONSTANTS.BOT,
        text: `${user.userName} join ${user.roomName}`,
      })
    );
    // send the roomName and the all users in the room to the every client
    socketIo.to(user.roomName).emit(CONSTANTS.ROOM_NAME_AND_USERS, {
      roomName: user.roomName,
      roomUsers: getUsers(user.roomName),
    });
  });

  socket.on(CONSTANTS.SEND_MSG, (msg) => {
    // listen to the sendMsg event and msg will receive when the client emits the sendMsg event
    const user = getUserBySocketId(socket.id); // get the user object by the socket id
    //  send the message to all the clients in the room
    socketIo
      .to(user.roomName)
      .emit(
        CONSTANTS.MESSAGE,
        formatMsg({ userName: user.userName, text: msg })
      );
  });

  socket.on('disconnect', () => {
    // disconnect event is built-in event in socket.io and it will be triggered when a client disconnects from the server
    const user = getLeftUser(socket.id); // get the user object by the socket id and remove the user from the users array
    if (user != null) {
      // if the user is not null
      // send a message to all the clients in the room
      socketIo.to(user.roomName).emit(
        CONSTANTS.MESSAGE,
        formatMsg({
          userName: CONSTANTS.BOT,
          text: `${user.userName} left the room`,
        })
      );
      // send the roomName and the all users in the room to the every client
      socketIo.to(user.roomName).emit(CONSTANTS.ROOM_NAME_AND_USERS, {
        roomName: user.roomName,
        roomUsers: getUsers(user.roomName),
      });
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  // listen on port 3000
  console.log(`Server is running on port http://localhost:${PORT}`);
});
