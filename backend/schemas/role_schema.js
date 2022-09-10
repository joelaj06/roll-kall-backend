const mongoose = require("mongoose");

const role_schema = new mongoose.Schema({
    name : String,
    permissions : [String],

});

module.exports = role_schema;