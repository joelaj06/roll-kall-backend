const mongoose = require("mongoose");

const activeUsersOfTheWeek = mongoose.Schema({
    dates : [String],
    users : [Number]
});

module.exports = activeUsersOfTheWeek;