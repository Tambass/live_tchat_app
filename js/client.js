const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
var audio = new Audio("ringtone.mp3");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  audio.play();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`Toi: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});
const name = prompt("Entrez votre nom pour rejoindre le t'chat");
socket.emit("new-user-joined", name);

socket.on("user-joined", (name) => {
  append(`${name} a rejoint le t'chat`, "right");
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

socket.on("left", (name) => {
  append(`${name} a quitté le t'chat`, "left");
});
