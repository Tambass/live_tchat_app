// Node server which will handle socket.io connection

const io = require("socket.io")(8000);

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    //si un utilisateur rejoint le t'chat, on informe les autres utilisateurs connectés au serveur
    //console.log('new user', name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    //si quelqu'un envoie un message, on le diffuse aux autres personnes
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    //si quelqu'un quitte le chat, on informe les autres
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
