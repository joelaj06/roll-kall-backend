const express = require("express");
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  getUser,
  logout,
} = require("../controllers/users_controller.js");
const { protect } = require("../middleware/auth_middleware");
const {checkPermission} = require('../middleware/permission_middleware')

const router = express.Router();

router.post("/", addUser);
router.post("/login", loginUser);
router.post('/logout',protect, logout);
router.get("/user", protect, getUser);
router.get("/:id?",protect,checkPermission('CanViewUsers'),getUsers);
router.route("/:id").put(protect,checkPermission('CanUpdateUser'),updateUser)
.delete(protect,checkPermission('CanDeleteUser'),deleteUser);

module.exports = router;
