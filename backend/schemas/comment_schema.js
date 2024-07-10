const mongoose = require("mongoose");

const comment_schema = new mongoose.Schema({
  comment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
});

module.exports = comment_schema;
