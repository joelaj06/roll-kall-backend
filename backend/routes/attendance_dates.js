const express = require("express");
const { protect } = require("../middleware/auth_middleware");
const {
  getUserDates,
  checkIn,
  checkOut,
} = require("../controllers/attendance_dates_controller");
const { checkPermission } = require("../middleware/permission_middleware");

const router = express.Router();

router.post("/", protect,checkPermission("CanClockIn"), checkIn);
router
  .route("/:id")
  .get(protect, checkPermission("CanViewAttendanceHistory"), getUserDates)
  .put(protect,checkPermission("CanClockOut") ,checkOut);

module.exports = router;
