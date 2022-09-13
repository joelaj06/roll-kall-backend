const mongoose = require('mongoose');
const team_schema = require('../schemas/team_schema');

const Team = mongoose.model('Team', team_schema);

module.exports = {Team};