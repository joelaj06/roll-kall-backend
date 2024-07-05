const asyncHandler = require("express-async-handler");
const { AttendanceDate } = require("../models/attendance_date_model.js");
const { User } = require("../models/user_model.js");
const { addDays } = require("../utils/date_formatter.js");

// @desc - get user's check in time
// @route -  POST /api/attendance_dates
// @access - PRIVATE
const checkIn = asyncHandler(async (req, res) => {
  const { check_in, check_out, location } = req.body;

  let checkIn = new AttendanceDate({
    check_in,
    check_out,
    location,
    user: req.user.id,
  });

  await checkIn.save();
  if (checkIn) {
    res.status(201).json(checkIn);
  }
});

// @desc - get user's checkout  time
// @route -  POST /api/attendance_dates/:id
// @access - PRIVATE
const checkOut = asyncHandler(async (req, res) => {
  try {
    let user = undefined;
    user = await User.findById(req.user.id);
    let attendanceDate = await AttendanceDate.findById(req.params.id);
    if (!attendanceDate) {
      throw new Error("Attendance Date Not Found");
    }
    if (user == undefined) {
      throw new Error("User not found");
    } else {
      if (user.completed) throw new Error("User already checked out");
      if (user.id == attendanceDate.user) {
        const updatedCheckOut = await AttendanceDate.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        res.status(200).json(updatedCheckOut);
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error("User not found");
  }
});

// @desc - get user's attendance history
// @route -  GET /api/attendance_dates
// @access - PRIVATE
const getUserDates = asyncHandler(async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  let endDate = addDays(req.query.end_date, 1);
  let startDate = req.query.start_date;
  const startIndex = (page - 1) * limit;
  let query = {};
  if (req.params.id) {
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
    const userDates = await AttendanceDate.find(query)
      .limit(limit)
      .skip(startIndex);
    if (userDates) {
      res.status(200).json(userDates);
    }
  } else {
    const userDates = await AttendanceDate.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    res.status(200).json(userDates);
  }
});

// @desc - get user's attendance history
// @route -  GET /api/attendance_dates/summary?userId=userId
// @access - PRIVATE
const getUserAttendanceSummary = asyncHandler(async (req, res) => {
  try {
    const userId = req.query.userId;

    // Find all completed attendance records for the user
    const attendanceRecords = await AttendanceDate.find({
      user: userId,
      completed: true,
    });

    if (attendanceRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this user" });
    }

    // Initialize variables for calculations
    let totalWorkingHours = 0;
    let totalCheckInSeconds = 0;
    let totalCheckOutSeconds = 0;
    let totalLeave = 0;
    const totalDays = attendanceRecords.length;

    // Helper function to convert time string (HH:mm) to seconds
    const timeToSeconds = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 3600 + minutes * 60;
    };

    attendanceRecords.forEach((record) => {
      if (record.check_in && record.check_out) {
        const checkInSeconds = timeToSeconds(record.check_in);
        const checkOutSeconds = timeToSeconds(record.check_out);

        totalCheckInSeconds += checkInSeconds;
        totalCheckOutSeconds += checkOutSeconds;

        const workingSeconds = checkOutSeconds - checkInSeconds;
        totalWorkingHours += workingSeconds;
      } else {
        totalLeave += 1;
      }
    });

    // Calculate averages
    const avgWorkingHrs = Math.round(totalWorkingHours / totalDays);
    const avgCheckIn = Math.round(totalCheckInSeconds / totalDays);
    const avgCheckOut = Math.round(totalCheckOutSeconds / totalDays);

    // Send the response
    res.status(200).json({
      avgWorkingHrs,
      avgCheckIn,
      avgCheckout: avgCheckOut,
      totalLeave,
    });
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error("Error retrieving user attendance summary");
  }
});

module.exports = {
  checkIn,
  getUserDates,
  checkOut,
  getUserAttendanceSummary,
};
