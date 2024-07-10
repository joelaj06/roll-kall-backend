const mongoose = require("mongoose");

const task_schema = new mongoose.Schema(
  {
    title: String,
    description: String,
    createdBy: String,
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    attachments: [String],
    location: {
      long: { type: String }, //TODO set location required
      lat: { type: String },
      radius: { type: String },
    },
    start_date: Date,
    due_date: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = task_schema;
