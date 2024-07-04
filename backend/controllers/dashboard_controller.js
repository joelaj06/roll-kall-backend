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

module.exports = { getDashboardSummary };
