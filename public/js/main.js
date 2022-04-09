const socket = io()
const chartForm = document.getElementById("chat-form")
const chatMessage = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })   // get the value of the query string
socket.emit("joinRoom", { username, room })  // emit the message to the server

const outPutMsg = (msgObj) => { // add a new message to the chat
    const { username, msg, time } = msgObj
    const div = document.createElement("div")
    div.classList.add("message")
    div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
    <p class="text">
      ${msg}
    </p>`
    document.querySelector(".chat-messages").appendChild(div)
}

socket.on("message", (msg) => { // add a new message to the chat
    outPutMsg(msg)
    chatMessage.scrollTop = chatMessage.scrollHeight
})
socket.on("roomUsers", ({room, users}) => { // add a new user to the chat
    outPutRoomName(room)
    outPutUsers(users)
})

const outPutRoomName = () => {  // add a new room to the chat
    roomName.textContent = room
}

const outPutUsers = (user) => { // add a new user to the chat
    userList.innerHTML = `
    ${user.map(user => `<li>${user.username}</li>`).join("")}
    `
}

chartForm.addEventListener("submit", (e) => {   //  add event listener to the form
    e.preventDefault()
    const msg = e.target.elements.msg.value;
    socket.emit("sendMessage", msg)
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()

})