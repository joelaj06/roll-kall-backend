const express = require('express');
const { getLeavesOfTheWeek } = require('../controllers/leaves_of_the_week_controller');
const {protect} = require('../middleware/auth_middleware');
const {checkPermission} = require('../middleware/permission_middleware');

const router = express.Router();

router.get('/', protect, checkPermission('CanViewLeavesOfTheWeek'), getLeavesOfTheWeek);

module.exports = router;