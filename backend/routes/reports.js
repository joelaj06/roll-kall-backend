const express = require("express");
const { protect } = require("../middleware/auth_middleware");
const { checkPermission } = require("../middleware/permission_middleware");
const {
  generateDailyAttendanceReport,
  generateAbsenteeismReport,
  generateAttendanceSummaryReport,
  generateGeolocationReport,
  generateLeaveManagementReport,
} = require("../controllers/reports_controller");

const router = express.Router();

router.get(
  "/daily-attendance",
  protect,
  checkPermission("CanViewDailyAttendanceReport"),
  generateDailyAttendanceReport
);
router.get(
  "/absenteeism",
  protect,
  checkPermission("CanViewAbsenteeismReport"),
  generateAbsenteeismReport
);
router.get(
  "/attendance-summary",
  protect,
  checkPermission("CanViewAttendanceSummaryReport"),
  generateAttendanceSummaryReport
);
router.get(
  "/geolocation",
  protect,
  checkPermission("CanViewGeolocationReport"),
  generateGeolocationReport
);
router.get(
  "/leave-management",
  protect,
  checkPermission("CanViewLeaveManagementReport"),
  generateLeaveManagementReport
);

module.exports = router;
