const mongoose = require("mongoose");
const comment_schema = require("../schemas/comment_schema");

const Comment = mongoose.model("Comment", comment_schema);

module.exports = { Comment };
