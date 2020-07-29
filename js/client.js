const socket = io("http://localhost:8000");

// Obtenir les éléments du DOM dans des variables JS respectives
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// Audio qui est joué quand un message est reçu
var audio = new Audio("ringtone.mp3");

//fonction qui ajoutera les informations dans le container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

// Demande à l'utilisateur de rentrer son nom et on informe le server
const name = prompt("Entrez votre nom pour rejoindre le t'chat");
socket.emit("new-user-joined", name);

// Si un nouvel utilisateur rejoint le t'chat, on informe le server de son nom
socket.on("user-joined", (name) => {
  append(`${name} a rejoint le t'chat`, "right");
});

// Si le server envoi un message, on le reçoi
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

// Si un utilisateur quitte le t'chat, on informe les autres utilisateurs
socket.on("left", (name) => {
  append(`${name} a quitté le t'chat`, "left");
});

// Si le formulaire est soumi, on envoi le message au server
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`Toi: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  });