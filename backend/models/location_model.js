const mongoose = require("mongoose");
const location_schema = require("../schemas/location_schema");

const Locaton = mongoose.model("Locaton", location_schema);

module.exports = { Locaton };
