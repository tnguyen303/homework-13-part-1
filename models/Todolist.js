const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const toDoSchema = new Schema({
  task: {
    type: String,
    unique: true,
    required: "You must include a unique task"
  },
  done: {
    type: Boolean,
    required: "You must include this"
  }
});

// This creates our model from the above schema, using Mongoose's model method
const toDoList = mongoose.model('toDoList', toDoSchema);

// Export the to do list model
module.exports = toDoList;
