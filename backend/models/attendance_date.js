const mongoose = require('mongoose');
const {attendance_date_schema }= require('../schemas/attendance_dates_schema.js');

const AttendanceDate = mongoose.model('AttendanceDate', attendance_date_schema);

module.exports = { AttendanceDate };
