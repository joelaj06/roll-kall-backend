const express = require("express");
const {
  getDashboardSummary,
  getOnTimeRecordOfTheWeek,
  getCurrentPresentUsers,
} = require("../controllers/dashboard_controller");
const { protect } = require("../middleware/auth_middleware");
const { checkPermission } = require("../middleware/permission_middleware");

const router = express.Router();

router.get(
  "/dashboard_summary",
  protect,
  checkPermission("CanViewDashboardSummary"),
  getDashboardSummary
);
router.get(
  "/onTimeRecordOfTheWeek",
  protect,
  checkPermission("CanViewOnTimeRecordOfTheWeek"),
  getOnTimeRecordOfTheWeek
);
router.get(
  "/currentPresentUsers",
  protect,
  checkPermission("CanViewOnCurrentPresentUsers"),
  getCurrentPresentUsers
);

module.exports = router;
