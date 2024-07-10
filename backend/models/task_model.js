const mongoose = require("mongoose");
const task_schema = require("../schemas/task_schema");

const Task = mongoose.model("Task", task_schema);

module.exports = { Task };
