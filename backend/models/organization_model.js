const mongoose = require('mongoose');
const organization_schema = require('../schemas/organization_schema');


const Organization = mongoose.model('Organization', organization_schema);



module.exports = {Organization};