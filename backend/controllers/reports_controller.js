const asyncHandler = require("express-async-handler");
const createPdf = require("../services/pdf/pdf_service");
const { AttendanceDate } = require("../models/attendance_date_model");
const { Organization } = require("../models/organization_model");
const { User } = require("../models/user_model");
const { Leave } = require("../models/leave_model");
const { calculateWorkingHours } = require("../utils/helper_funtions");
const luxon = require("luxon");
const { DateTime } = luxon;

//@desc get daily attendance report
//@route GET /api/reports/dailyAttendanceReport
//@access PRIVATE
const generateDailyAttendanceReport = asyncHandler(async (req, res) => {
  const { date } = req.query;
  try {
    const attendances = await AttendanceDate.find({ createdAt: date })
      .populate("user")
      .lean();

    // Fetch company information
    const organization = await Organization.findOne().lean();

    // Format and generate the PDF report
    const reportData = attendances.map((att) => ({
      name: `${att.user.first_name} ${att.user.last_name}`,
      date: DateTime.fromISO(att.createdAt.toISOString()).toLocaleString({}),
      checkIn: att.check_in,
      checkOut: att.check_out,
      workingHours: calculateWorkingHours(att.check_in, att.check_out),
      location: "Not set",
    }));

    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    });

    createPdf.dailyAttendanceReportPDF(
      "Daily Attendance Report",
      date,
      reportData,
      organization,
      (chunk) => stream.write(chunk),
      () => stream.end()
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//@desc get attendance summary report
//@route GET /api/reports/attendanceSummaryReport
//@access PRIVATE
const generateAttendanceSummaryReport = asyncHandler(async (req, res) => {
  try {
    const attendances = await AttendanceDate.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("user", "name")
      .lean();

    const summary = {};

    attendances.forEach((att) => {
      if (!summary[att.user.name]) {
        summary[att.user.name] = { totalCheckIns: 0, totalCheckOuts: 0 };
      }
      summary[att.user.name].totalCheckIns += 1;
      summary[att.user.name].totalCheckOuts += 1;
    });

    const path = createPdf("Attendance Summary Report", summary);
    res.download(path, "attendance_summary_report.pdf");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc get geolocation report
//@route GET /api/reports/geolocationReport
//@access PRIVATE
const generateGeolocationReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const attendances = await AttendanceDate.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("user", "name")
      .lean();

    const reportData = attendances.map((att) => ({
      name: att.user.name,
      checkIn: att.check_in,
      checkOut: att.check_out,
      location: `${att.location.lat}, ${att.location.long}`,
    }));

    const path = createPdf("Geolocation Report", reportData);
    res.download(path, "geolocation_report.pdf");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc get absenteeism report
//@route GET /api/reports/absenteeismReport
//@access PRIVATE
const generateAbsenteeismReport = asyncHandler(async (req, res) => {
  const { date } = req.query;
  try {
    const allUsers = await User.find().lean();
    const attendances = await AttendanceDate.find({ date }).lean();

    const presentUserIds = attendances.map((att) => att.user.toString());
    const absentUsers = allUsers.filter(
      (user) => !presentUserIds.includes(user._id.toString())
    );

    const reportData = absentUsers.map((user) => ({
      name: user.name,
      date: date,
    }));

    const path = createPdf("Absenteeism Report", reportData);
    res.download(path, "absenteeism_report.pdf");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc get leave management report
//@route GET /api/reports/leaveManagementReport
//@access PRIVATE
const generateLeaveManagementReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const leaves = await Leave.find({
      startDate: { $gte: startDate, $lte: endDate },
    })
      .populate("user", "name")
      .lean();

    const reportData = leaves.map((leave) => ({
      name: leave.user.name,
      startDate: leave.date,
      endDate: leave.end_date,
      status: leave.status,
    }));

    const path = createPdf("Leave Management Report", reportData);
    res.download(path, "leave_management_report.pdf");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  generateDailyAttendanceReport,
  generateAttendanceSummaryReport,
  generateGeolocationReport,
  generateAbsenteeismReport,
  generateLeaveManagementReport,
};