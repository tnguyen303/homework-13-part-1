const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const app = express();
const PORT = process.env.PORT || 3000;

// const toDoList = require('./todo-list.js');

const db = require("./models/Todolist");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB using the inventorymaster database (will be created if it doesn't exist)
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://user:123456a@ds121203.mlab.com:21203/heroku_zr357z2k",
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("Mongodb connected..."))
  .catch(err => console.log(err));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.use(express.static(__dirname + "/public"));

app.delete("/api/todolist/:taskQuery", function(req, res) {
  db.remove({ task: req.params.taskQuery })
    .then(function() {
      res.json(db);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log(`App listening on PORT ${PORT}`);
});

app.get("/api/todolist", function(req, res) {
  db.find({})
    .then(function(list) {
      res.json(list);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/api/todolist", function(req, res) {
  new db(req.body)
    .save()
    .then(function() {
      res.json({ success: true });
    })
    .catch(function(err) {
      res.json(err);
    });
});
