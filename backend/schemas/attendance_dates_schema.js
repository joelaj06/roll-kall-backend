const mongoose = require("mongoose");

const attendance_date_schema = new mongoose.Schema(
  {
    check_in: String,
    check_out: String,
    start_date: {
      type: Date,
      default: Date.now(),
    },
    location: String,
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports.attendance_date_schema = attendance_date_schema;
