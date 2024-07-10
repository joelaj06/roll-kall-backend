const express = require("express");
const {
  getTasks,
  addTask,
  updateTask,
  getTask,
  deleteTask,
  addComment,
  updateComment,
} = require("../controllers/tasks_controller");
const { protect } = require("../middleware/auth_middleware");
const { checkPermission } = require("../middleware/permission_middleware");

const router = express.Router();

router.put("/comments/:commentId", protect, updateComment);
router.post("/:id/comments", protect, addComment);
router
  .route("/")
  .post(protect, checkPermission("CanCreateTask"), addTask)
  .get(protect, checkPermission("CanViewTasks"), getTasks);
router.get("/:id", protect, checkPermission("CanViewTask"), getTask);
router
  .route("/:id")
  .put(protect, checkPermission("CanUpdateTask"), updateTask)
  .delete(protect, checkPermission("CanDeleteTask"), deleteTask);

module.exports = router;
