const mongoose = require('mongoose');
const role_schema = require('../schemas/role_schema');

const Role = mongoose.model('Role', role_schema);

module.exports = {Role};