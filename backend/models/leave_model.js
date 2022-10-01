const mongoose = require('mongoose');
const leaveSchema = require('../schemas/leave_schema');

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = {Leave}