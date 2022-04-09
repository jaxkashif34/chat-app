const users = []
const userJoin = (id, username, room) => {  // add a new user to the array users
    const user = { id, username, room }
    users.push(user)
    return user
}

const getCurrentUser = (id) => {    // get the user from the array users
    return users.find(user => user.id === id)
}

const userLeave = (id) => {  // remove the user from the array users
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getRoomUsers = (room) => {    // get the users in the room
    return users.filter(user => user.room === room)
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers }