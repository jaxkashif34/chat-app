const express = require('express')
const app = express()
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const formatMsg = require('./utils/messag')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/user")

const server = http.createServer(app)   // create server
const io = socketio(server) // create socket
app.use(express.static(path.join(__dirname, "public"))) // use static files
const admin = "Chat Bot"
io.on("connection", socket => { // when a client connects   
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room)    // add a new user to the array users
        socket.join(user.room)  // join the room
        socket.emit("message", formatMsg(admin, `${username} welcome to ${room}`)) // send a message to the client
        socket.broadcast.to(user.room).emit("message", formatMsg(admin, `${username} joined ${room}`))  // send a message to all clients except that one is connecting

        io.to(user.room).emit("roomUsers", {    // send user and room info
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    socket.on("sendMessage", (msg) => { // receive the message from the client
        const user = getCurrentUser(socket.id)  // get the user from the array users
        io.to(user.room).emit("message", formatMsg(user.username, msg))  // send the message to all clients
    })

    socket.on("disconnect", () => { // when a client disconnects
        const user = userLeave(socket.id)   // remove the user from the array users
        if (user) {   // if the user is not undefined
            io.emit("message", formatMsg(admin, `${user.username} left`)) // send a message to all clients
            io.to(user.room).emit("roomUsers", {    // send user and room info
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })

})



const PORT = process.env.PORT || 3000
server.listen(PORT, () => { // listen on port 3000
    console.log(`Server is running on port http://localhost:${PORT}`)
})

