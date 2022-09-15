const mongoose = require("mongoose");

const organization_schema = new mongoose.Schema({
  name: {
    type : String, 
    required : true,
  },
  description : String,
  code: String,
  location: 
    {
      long: String,
      lat: String,
    },
  arrival_time: String,
  departure_time: String,
  motto: String,
  logo: String,
});

module.exports = organization_schema;
