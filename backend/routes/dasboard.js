const express = require("express");
const { getDashboardSummary } = require("../controllers/dashboard_controller");
const { protect } = require("../middleware/auth_middleware");
const { checkPermission } = require("../middleware/permission_middleware");

const router = express.Router();

router.get(
  "/dashboard_summary",
  protect,
  checkPermission("CanViewDashboardSummary"),
  getDashboardSummary
);

module.exports = router;
