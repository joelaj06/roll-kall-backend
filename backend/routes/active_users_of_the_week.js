const {protect} = require('../middleware/auth_middleware');
const {checkPermission} = require('../middleware/permission_middleware');
const express = require('express');
const {getUsersOfTheWeek} = require('../controllers/active_users_of_the_week_controller');

const router = express.Router();

router.get('/', protect, checkPermission('CanViewActiveUsersOfTheWeekReport'),getUsersOfTheWeek);

module.exports = router;
