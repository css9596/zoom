const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName, nickName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const roomInput = form.querySelector("#roomName");
    const nickInput = form.querySelector("#nickName");
    socket.emit("enter_room", roomInput.value, nickInput.value, showRoom);
    roomName = roomInput.value;
    nickName = nickInput.value;
    roomInput.value = "";
    nickInput.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

//This method is processing the contents requested by server.js
//emit.("FUNCTION_NAME")
socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} joined!`);
});

socket.on("bye", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} left!`);
});

socket.on("new_message", addMessage);
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    if(rooms.length === 0) {
        roomList.innerHTML = "";
        return;
    }
    rooms.forEach(room => {
       const li = document.createElement("li");
       li.innerText = room;
       roomList.append(li);
    });
});
