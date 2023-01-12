const CONSTANTS = {
  JOIN_ROOM: 'JOIN_ROOM',
  MESSAGE: 'MESSAGE',
  USER_JOIN: 'USER_JOIN',
  ROOM_NAME_AND_USERS: 'ROOM_NAME_AND_USERS',
  SEND_MSG: 'SEND_MSG',
};

const socket = io();
const chartForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const room = document.getElementById('room-name');
const userList = document.getElementById('users');
const leaveBtn = document.querySelector('.leave-btn');
const joinForm = document.getElementById('join-form');

// Get username and room from URL
const { userName, roomName } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit(CONSTANTS.JOIN_ROOM, { userName, roomName });

socket.on(CONSTANTS.MESSAGE, (message) => {
  outputMessage(message);
});

socket.on(CONSTANTS.USER_JOIN, (message) => {
  outputMessage(message);
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

socket.on(CONSTANTS.ROOM_NAME_AND_USERS, ({ roomName, roomUsers }) => {
  room.textContent = roomName;
  userList.innerHTML = roomUsers.map((user) => `<li>${user.userName}</li>`).join('');
});

chartForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const msg = event.target['msg'].value;
  socket.emit(CONSTANTS.SEND_MSG, msg);
  event.target['msg'].value = '';
  event.target['msg'].focus();
});

const outputMessage = (message) => {
  const { userName, time, text } = message;
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${userName} <span>${time}</span></p> <p class="text">${text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
};
