const asyncHandler = require("express-async-handler");

const { Task } = require("../models/task_model");
const { Comment } = require("../models/comment_model");

//@desc Get all tasks
//@route GET /api/tasks
//@access PRIVATE
const getTasks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchQuery = req.query.search || "";
  const start_date = req.query.start_date
    ? new Date(req.query.start_date)
    : null;
  const end_date = req.query.end_date ? new Date(req.query.end_date) : null;
  const startIndex = (page - 1) * limit;

  try {
    let query = {};

    // Apply search filter
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on task title
        { description: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on task description
      ];
    }

    // Apply date filter
    if (start_date && end_date) {
      query.createdAt = { $gte: start_date, $lte: end_date };
    } else if (start_date) {
      query.createdAt = { $gte: start_date };
    } else if (end_date) {
      query.createdAt = { $lte: end_date };
    }

    const totalCount = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.set(
      "x-pagination",
      JSON.stringify({
        totalPages,
        pageCount: page,
        totalCount,
      })
    );

    const tasks = await Task.find(query)
      .populate("assignee", "-password -tokens")
      .populate("reviewer", "-password -tokens")
      .populate("comments")
      .populate("location")
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc Create new task
//@route POST /api/tasks
//@access PRIVATE
const addTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    assignee,
    reviewer,
    status,
    comments,
    attachments,
    location,
    start_date,
    due_date,
  } = req.body;

  const task = new Task({
    title,
    description,
    assignee,
    reviewer,
    status,
    comments,
    attachments,
    location,
    start_date,
    due_date,
  });
  try {
    await task.save();
    if (task) {
      res.status(201).json(task);
    } else {
      res.status(400);
      throw new Error("Failed to add task");
    }
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

//@desc Update a task
//@route PUT /api/tasks/:id
//@access PRIVATE
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedTask) {
      res.status(200).json(updatedTask);
    } else {
      res.status(400);
      throw new Error("Failed to update task");
    }
  } else {
    res.status(400);
    throw new Error("Task not found");
  }
});

//@desc add comment to task
//@route POST /api/tasks/:id/comments
//@access PRIVATE
const addComment = asyncHandler(async (req, res) => {
  const { comment, taskId } = req.body;
  const user = req.user;

  // Create the new comment
  const newComment = new Comment({
    comment,
    user,
    task: taskId,
  });

  const savedComment = await newComment.save();

  // Update the task with the new comment ID
  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.comments.push(savedComment._id);
  const savedTask = await task.save();
  if (savedTask) res.status(201).json(savedComment);
  else {
    res.status(400);
    throw new Error("Failed to add comment");
  }
});

//@desc update comment
//@route PUT /api/tasks/comments/:commentId
//@access PRIVATE
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, {
    new: true,
  });
  if (updatedComment) {
    res.status(200).json(updatedComment);
  } else {
    res.status(400);
    throw new Error("Failed to update comment");
  }
});

//@desc Delete a task
//@route DELETE /api/tasks/:id
//@access PRIVATE
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (deletedTask) {
      res.status(200).json(deletedTask);
    } else {
      res.status(400);
      throw new Error("Failed to delete task");
    }
  } else {
    res.status(400);
    throw new Error("Task not found");
  }
});

//@desc Get a task
//@route GET /api/tasks/:id
//@access PRIVATE
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    res.status(200).json(task);
  } else {
    res.status(400);
    throw new Error("Task not found");
  }
});

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getTask,
  addComment,
  updateComment,
};
