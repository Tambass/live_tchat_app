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
// const name = prompt("Entrez votre nom pour rejoindre le t'chat");
// socket.emit("new-user-joined", name);

// Custom PROMPT

function testit() {
  alertBox("prompt", "");
}

function alertReturn(r) {
  if (!r) {
    alert("Pseudo obligatoire");
    redirect("/");
  } else {
    alert(r + " vous êtes connecté");
  }
}

function alertBox(type, text) {
  const button =
    '<div id="alertBox_button_div" ><input id="alertBox_button" class="button" style="margin: 7px;" type="button" value="Close" onclick="alertBox_hide()"></div>';

  const field = '<div><input id="ptext" class="field" type="text"></div>';

  if (type == "err") {
    document.getElementById("alertBox_text").innerHTML = text + button;
    document.getElementById("alertBox_text").style.color = "#FF0000";
    document.getElementById("alertBox_text").style.top = "50%";
  } else if (type == "ok") {
    document.getElementById("alertBox_text").innerHTML = text + button;
    document.getElementById("alertBox_text").style.top = "50%";
  } else if (type == "prompt") {
    document.getElementById("alertBox_text").innerHTML = text + field + button;
    document.getElementById("alertBox_text").style.top = "25%";
    document.getElementById("alertBox_button").value = "OK";
    document.getElementById("alertBox_button").onclick = function () {
      const name = document.getElementById("ptext").value;
      alertReturn(document.getElementById("ptext").value);
      console.log("Le nom est : ", name);
      socket.emit("new-user-joined", name);
      alertBox_hide();
      document.querySelector(".container").style.display = "block";
      document.querySelector(".send").style.display = "block";
    };
    if (text) {
      document.getElementById("ptext").value = text;
    }
  } else {
    document.getElementById("alertBox_text").innerHTML = text;
  }

  document.getElementById("alertBox_container").style.visibility = "visible";
} //end function

function alertBox_hide() {
  document.getElementById("alertBox_container").style.visibility = "hidden";
  document.getElementById("connect").style.visibility = "hidden";

  // const newUser = document.createElement("li");
  // const userName = document.createTextNode(`${name}`);
  // newUser.appendChild(userName);
  // const users = document.querySelector(".list");
  // document.body.innerText(newUser, users);
}

// Si un nouvel utilisateur rejoint le t'chat, on informe le server de son nom
socket.on("user-joined", (name) => {
  append(`${name} a rejoint le t'chat`, "right");
  // const newUser = document.createElement("li");
  // const userName = document.createTextNode(`${name}`);
  // newUser.appendChild(userName);
  // const users = document.querySelector(".list");
  // users.appendChild(userName);
  // document.body.innerText(newUser, users);
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
  append(`Moi: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});
