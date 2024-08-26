const asyncHandler = require("express-async-handler");
const { AttendanceDate } = require("../models/attendance_date_model.js");
const { User } = require("../models/user_model.js");
const { addDays, changeToSeconds } = require("../utils/date_formatter.js");
const mongo = require("mongodb");
const { Task } = require("../models/task_model.js");
const { calculateWorkingHours } = require("../utils/helper_funtions.js");
const { Leave } = require("../models/leave_model.js");

// @desc - get user's check in time
// @route -  POST /api/attendance_dates
// @access - PRIVATE
const checkIn = asyncHandler(async (req, res) => {
  const { check_in, check_out, location, taskId, isCheckedIn } = req.body;
  const now = new Date();
  const checkInTime = now;

  if (isCheckedIn) {
    const attendanceDate = await AttendanceDate.findOne({
      task: taskId, //mongo.ObjectId(taskId),
    });
    if (attendanceDate) {
      res.status(200).json(attendanceDate);
    } else {
      res.status(200).json({
        checkIn: "",
        checkOut: "",
        location: "",
        task: "",
        user: "",
        completed: false,
        is_checked_in: false,
        _id: "",
      });
    }
    return;
  }

  let checkIn = new AttendanceDate({
    check_in: checkInTime,
    check_out,
    location,
    task: taskId,
    user: req.user.id,
    completed: false,
    is_checked_in: true,
  });

  await checkIn.save();
  if (checkIn) {
    res.status(201).json({
      ...checkIn,
      check_in: new Date(checkIn.check_in).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }
});

// @desc - get user's checkout  time
// @route -  POST /api/attendance_dates/:id
// @access - PRIVATE
const checkOut = asyncHandler(async (req, res) => {
  try {
    let user = undefined;
    user = await User.findById(req.user.id);
    const attendanceDate = await AttendanceDate.findById(req.params.id);
    if (!attendanceDate) {
      throw new Error("Attendance Date Not Found");
    }
    if (user == undefined) {
      throw new Error("User not found");
    } else {
      if (user.completed) throw new Error("User already checked out");
      if (user.id == attendanceDate.user) {
        const payload = {
          completed: true,
          check_out: new Date(),
        };
        const updatedCheckOut = await AttendanceDate.findByIdAndUpdate(
          req.params.id,
          payload,
          { new: true }
        );
        await Task.findByIdAndUpdate(attendanceDate.task, {
          status: "completed",
        });
        res.status(200).json({
          ...updatedCheckOut,
          check_in: new Date(updatedCheckOut.check_in).toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          check_out: new Date(updatedCheckOut.check_out).toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        });
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
  let totalCount = 0;
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
    totalCount = await AttendanceDate.countDocuments(query);

    const userDates = await AttendanceDate.find(query)
      .limit(limit)
      .skip(startIndex);
    if (userDates) {
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

      // Format the check-in and check-out dates to "00:00" format
      const formattedUserDates = userDates.map((date) => ({
        ...date._doc, // Preserve other fields
        check_in: new Date(date.check_in).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        check_out: date.check_out
          ? new Date(date.check_out).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        workingHrs: date.check_out
          ? calculateWorkingHours(date.check_in, date.check_out)
          : null,
      }));
      res.status(200).json(formattedUserDates);
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

    // Helper function to convert a Date object to seconds since midnight
    const dateToSeconds = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return hours * 3600 + minutes * 60;
    };

    const leaves = await Leave.find({ user: userId });

    attendanceRecords.forEach((record) => {
      if (record.check_in && record.check_out) {
        const checkInDate = new Date(record.check_in);
        const checkOutDate = new Date(record.check_out);

        const checkInSeconds = dateToSeconds(checkInDate);
        const checkOutSeconds = dateToSeconds(checkOutDate);

        totalCheckInSeconds += checkInSeconds;
        totalCheckOutSeconds += checkOutSeconds;

        const workingSeconds = checkOutSeconds - checkInSeconds;
        totalWorkingHours += workingSeconds;
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
      totalLeave: leaves.length,
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
