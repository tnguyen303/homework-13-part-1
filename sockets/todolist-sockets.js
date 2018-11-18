module.exports = function(io) {
  console.log("running");
  //this .on listener runs everytime a user connect
  io.on("connection", function(socket) {
    //SOCKET ROUTES

    // push to all sockets
    socket.on("add-todo", function(data) {
      console.log(data);
      //send to all users
      io.emit("emit-add", data);
    });

    socket.on("finish-todo", function(data) {
      io.emit("emit-finish", data);
    });

    socket.on("delete-todo", function(data) {
      io.emit("emit-delete", data);
    });
  });
};
