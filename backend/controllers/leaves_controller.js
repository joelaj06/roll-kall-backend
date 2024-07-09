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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const { date_filter, end_date, start_date, status_filter, status } =
    req.query;

  let query = {};
  if (req.params.id) {
    query._id = req.params.id;
  } else {
    if (date_filter) {
      let endDate = addDays(end_date, 1);
      query.createdAt = { $gte: new Date(start_date), $lte: new Date(endDate) };
    }
    if (status_filter) {
      query.status = status;
    }
  }

  try {
    const totalCount = await Leave.countDocuments(query);
    const leaves = await Leave.find(query)
      .populate("user", "-password -tokens")
      .limit(limit)
      .skip(startIndex);

    if (leaves) {
      const totalPages = Math.ceil(totalCount / limit);
      // Set pagination information in the headers

      res.set(
        "x-pagination",
        JSON.stringify({
          totalPages: totalPages,
          pageCount: page,
          totalCount: totalCount,
        })
      );

      res.status(200).json(leaves);
    } else {
      res.status(400);
      throw new Error("Failed to fetch leaves");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
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
      res.status(400);
      throw new Error("Update Failed, Only pending leaves can be updated");
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
