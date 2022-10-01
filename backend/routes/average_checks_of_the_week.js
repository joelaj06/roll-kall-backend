const express = require('express');
const {protect} = require('../middleware/auth_middleware');
const {checkPermission} = require('../middleware/permission_middleware');
const {averageCheckInOfTheWeek, averageCheckOutOfTheWeek} = require('../controllers/average_checks_controller')

const router = express.Router();

router.get('/checkIn', protect, checkPermission('CanViewAverageCheckInOfTheWeek'), averageCheckInOfTheWeek);
router.get('/checkOut', protect, checkPermission('CanViewAverageCheckOutOfTheWeek'), averageCheckOutOfTheWeek);

module.exports = router;