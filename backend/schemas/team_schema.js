const mongoose = require("mongoose");

const team_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members:[{type:  mongoose.SchemaTypes.ObjectId, ref: "User" }],  
    status: {
      type: String,
      required: true,
    },
    notes: String,
    code: String,
  },
  { timestamps: true }
);


module.exports = team_schema;
