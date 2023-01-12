const users = [];
const getUser = (user) => {
  users.push(user);
  return user;
};

const getUserBySocketId = (socketId) => users.find((user) => user.socketId === socketId);

const getUsers = (roomName) => users.filter((user) => user.roomName === roomName);
const getLeftUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);

  if (index !== -1) return users.splice(index, 1)[0];
};

module.exports = { getUser, getUsers, getUserBySocketId, getLeftUser };
