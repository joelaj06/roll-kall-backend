const mongoose = require("mongoose");

const role_schema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    permissions : [String],

});

module.exports = role_schema;