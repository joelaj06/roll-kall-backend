const express = require("express");
const {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
} = require("../controllers/roles_controller");
const { protect } = require("../middleware/auth_middleware");
const { checkPermission } = require("../middleware/permission_middleware");

const router = express.Router();

router.post("/", protect, checkPermission("CanCreateRole"), addRole);
router.get("/:id?", protect, checkPermission("CanViewRoles"), getRoles);
router
  .route("/:id")
  .put(protect, checkPermission("CanUpdateRole"), updateRole)
  .delete(protect, checkPermission("CanDeleteRole"), deleteRole);

module.exports = router;
