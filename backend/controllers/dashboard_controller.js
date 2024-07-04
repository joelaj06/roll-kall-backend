const asyncHandler = require("express-async-handler");
const { AttendanceDate } = require("../models/attendance_date_model");
const { User } = require("../models/user_model");
const { Team } = require("../models/team_model");
const { Organization } = require("../models/organization_model");
//@desc get dashboard data
//@route /api/dashboard_summary
//@access PRIVATE

const getDashboardSummary = asyncHandler(async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    // Get the number of teams
    const teamCount = await Team.countDocuments();

    // Get the number of offices
    const officeCount = await Organization.countDocuments();

    // Get the number of present users for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const presentUsersCount = await AttendanceDate.countDocuments({
      check_in: { $ne: null },
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    return res.status(200).json({
      total_users: userCount,
      total_present: presentUsersCount,
      total_teams: teamCount,
      total_offices: officeCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500);
    throw new Error("Failed to get dashboard summary");
  }
});

const getOnTimeRecordOfTheWeek = asyncHandler(async (req, res) => {
  try {
    // Get today's date and set the time to the start of the day (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the date of 7 days ago and set the time to the start of the day (00:00:00)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Use MongoDB's aggregation framework to process attendance records
    const attendanceRecords = await AttendanceDate.aggregate([
      // Match documents where the start_date is between seven days ago and today
      {
        $match: {
          start_date: { $gte: sevenDaysAgo, $lte: today },
        },
      },
      // Project new fields:
      // 'date' formatted as 'dd-MM-yyyy' and 'isOnTime' as true if check_in is on or before start_date
      {
        $project: {
          date: {
            $dateToString: { format: "%d-%m-%Y", date: "$start_date" },
          },
          isOnTime: { $lte: [{ $toDate: "$check_in" }, "$start_date"] },
        },
      },
      // Group by the 'date' field and count the number of onTime and late check-ins
      {
        $group: {
          _id: "$date",
          onTime: { $sum: { $cond: ["$isOnTime", 1, 0] } },
          late: { $sum: { $cond: ["$isOnTime", 0, 1] } },
        },
      },
      // Sort the results by date in ascending order
      {
        $sort: { _id: 1 },
      },
    ]);

    // Arrays to store the dates, onTime counts, and late counts
    const dates = [];
    const onTime = [];
    const late = [];

    // Helper function to format the date as 'dd-MM-yyyy'
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Loop through the last 7 days
    for (let i = 0; i < 7; i++) {
      // Get the date for the current day in the loop
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() - i);
      // Format the date as 'dd-MM-yyyy'
      const dateStr = formatDate(currentDay);
      dates.unshift(dateStr);

      // Find the record for the current day
      const record = attendanceRecords.find((r) => r._id === dateStr);
      if (record) {
        // If a record exists, add the onTime and late counts to the arrays
        onTime.unshift(record.onTime);
        late.unshift(record.late);
      } else {
        // If no record exists for the day, add zeros to the arrays
        onTime.unshift(0);
        late.unshift(0);
      }
    }

    // Send the response with the dates, onTime counts, and late counts
    res.status(200).json({
      dates,
      onTime,
      late,
    });
  } catch (error) {
    // Handle any errors and send a 500 response
    res.status(500);
    console.error(error);
    throw new Error("Error retrieving weekly attendance summary");
  }
});

const getCurrentPresentUsers = asyncHandler(async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const searchQuery = req.query.search || "";

    // Find attendance records for today
    let attendanceRecords = await AttendanceDate.find({
      start_date: { $gte: today },
      check_out: { $exists: false }, // Users who have not checked out yet
    }).populate("user");

    // Filter users based on the search query
    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      attendanceRecords = attendanceRecords.filter(
        (record) =>
          regex.test(record.user.first_name) ||
          regex.test(record.user.last_name)
      );
    }

    // Format the response
    const presentUsers = attendanceRecords.map((record) => ({
      user: {
        id: record.user._id,
        first_name: record.user.first_name,
        last_name: record.user.last_name,
        image: record.user.image,
      },
      check_in: record.check_in,
      check_out: record.check_out,
      is_late: new Date(record.check_in) > record.start_date,
    }));

    res.status(200).json(presentUsers);
  } catch (error) {
    res.status(500);
    throw new Error("Error retrieving current present users");
  }
});

module.exports = {
  getDashboardSummary,
  getOnTimeRecordOfTheWeek,
  getCurrentPresentUsers,
};
