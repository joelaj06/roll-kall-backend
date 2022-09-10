const express = require('express');
const {protect} = require('../middleware/auth_middleware');
const {
    getUserDates,
    checkIn,
    checkOut,
} = require("../controllers/attendance_dates_controller");

const router = express.Router();

router.post('/',protect,checkIn);
router.route('/:id').get(protect, getUserDates).put(protect, checkOut);


module.exports = router;