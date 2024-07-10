const mongoose = require("mongoose");

const location_schema = new mongoose.Schema({
  long: String,
  lat: String,
  radius: String,
});

module.exports = location_schema;
