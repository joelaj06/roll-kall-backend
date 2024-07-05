const asyncHandler = require("express-async-handler");
const { Leave } = require("../models/leave_model");
const { User } = require("../models/user_model");
const { addDays } = require("../utils/date_formatter");

//@desc create leave
//@route POST /api/leaves
//@access PRIVATE
const addLeave = asyncHandler(async (req, res) => {
  const { user, notes, status, date } = req.body;
  if (!user) {
    res.status(400);
    throw new Error("User is required");
  } else {
    let activeUser = await User.findById(user);
    if (activeUser) {
      const leave = new Leave({
        user,
        notes,
        status,
        date,
      });

      await leave.save();

      if (leave) {
        res.status(201).json(leave);
      } else {
        res.status(400);
        throw new Error("Failed to add leave");
      }
    } else {
      res.status(400);
      throw new Error("No user found");
    }
  }
});

//@desc get all leaves
//@route GET /api/leaves
//@access PRIVATE
const getLeaves = asyncHandler(async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  if (req.params.id) {
    const leaves = await Leave.findById(req.params.id)
      .populate("user", "-password -tokens")
      .limit(limit)
      .skip(startIndex);
    if (leaves) {
      res.status(200).json(leaves);
    } else {
      res.status(400);
      throw new Error("Failed to fetch leaves");
    }
  } else {
    let leaves;
    if (req.query.date_filter) {
      let endDate = addDays(req.query.end_date, 1);
      let startDate = req.query.start_date;
      leaves = await Leave.find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
        .populate("user", "-password -tokens")
        .limit(limit)
        .skip(startIndex);
    } else if (req.query.status_filter) {
      let status = req.query.status;
      leaves = await Leave.find({
        status: status,
      }).populate("user", "-password -tokens");
    } else if (req.query.status_filter && req.query.date_filter) {
      let endDate = addDays(req.query.end_date, 1);
      let startDate = req.query.start_date;
      let status = req.query.status;
      leaves = await Leave.find({
        createdAt: { $gte: startDate, $lte: endDate },
        status: status,
      })
        .populate("user", "-password -tokens")
        .limit(limit)
        .skip(startIndex);
    } else {
      leaves = await Leave.find()
        .populate("user", "-password -tokens")
        .limit(limit)
        .skip(startIndex);
    }

    if (leaves) {
      res.status(200).json(leaves);
    } else {
      res.status(400);
      throw new Error("Failed to fetch leaves");
    }
  }
});

//@desc get leaves of user
//@route PUT /api/leaves/user/:id
//@access PRIVATE

const getUserLeaves = asyncHandler(async (req, res) => {
  let endDate = addDays(req.query.end_date, 1);
  let startDate = req.query.start_date;
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;

  let user = await User.findById(req.params.id);
  if (!user) throw new Error("User not found");
  let query = {};
  if (
    req.query.status_filter &&
    req.query.date_filter &&
    req.query.status !== "all"
  ) {
    let status = req.query.status;
    if (startDate && endDate)
      query = {
        user: req.params.id,
        status: status,
        createdAt: { $gte: startDate, $lte: endDate },
      };
    else {
      query = {
        user: req.params.id,
        status: status,
      };
    }
    const leaves = await Leave.find(query)
      .populate("user", "-password -tokens")
      .limit(limit)
      .skip(startIndex);
    if (leaves) {
      res.status(200).json(leaves);
    } else {
      res.status(400);
      throw new Error("Failed to fetch leaves");
    }
  } else {
    if (startDate && endDate)
      query = {
        user: req.params.id,
        createdAt: { $gte: startDate, $lte: endDate },
      };
    else {
      query = {
        user: req.params.id,
      };
    }
    const leaves = await Leave.find(query)
      .populate("user", "-password -tokens")
      .limit(limit)
      .skip(startIndex);
    if (leaves) {
      res.status(200).json(leaves);
    } else {
      res.status(400);
      throw new Error("Failed to fetch leaves");
    }
  }
});

//@desc update leave
//@route PUT /api/leaves/:id
//@access PRIVATE
const updateLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (leave) {
    if (leave.status === "pending") {
      const newLeave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (newLeave) {
        res.status(200).json(newLeave);
      } else {
        res.status(400);
        throw new Error("Failed to update leave");
      }
    } else {
      res.status(200);
      throw new Error("Update Failed, Leave already approved");
    }
  } else {
    res.status(400);
    throw new Error("Leave not found");
  }
});

//@desc delete leave
//@route DELETE /api/leaves:id
//@access PRIVATE
const deleteLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (leave) {
    await leave.remove();
    res.status(200).json({ id: req.params.id });
  } else {
    res.status(400);
    throw new Error("Leave not found");
  }
});

//@desc get list of all leave request
//@route GET /api/leaves/request
//@access PRIVATE
const getLeaveRequest = asyncHandler(async (req, res) => {
  let leave;
  if (!req.query.date_filter) {
    leave = await Leave.find({ status: "pending" });
  } else {
    let endDate = addDays(req.query.end_date, 1);
    let startDate = req.query.start_date;
    leave = await Leave.find({
      status: "pending",
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }
  if (leave) {
    res.status(200).json(leave);
  } else {
    res.status(400);
    throw new Error("Failed to fetch leave requests");
  }
});

module.exports = {
  addLeave,
  getLeaves,
  updateLeave,
  deleteLeave,
  getUserLeaves,
  getLeaveRequest,
};
