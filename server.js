const express = require("express");
const app = express();
//http package lets you run server without Express, socket.io requires more control that is provided with this package
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB through mlab
mongoose
  .connect(
    // process.env.MONGODB_URI ||
      "mongodb://user:123456a@ds121203.mlab.com:21203/heroku_zr357z2k",
    { useNewUrlParser: true }
  )
  // .then(() => console.log("Mongodb connected..."))
  // .catch(err => console.log(err));

require("./sockets/todolist-sockets")(io);
require('./routes/html-routes')(app);
require('./routes/api-routes')(app);

app.listen(PORT, function() {
  console.log(`Server listening on PORT ${PORT}`);
});
