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
const checkOut = asyncHandler(async(req, res) => {
    try {
        let user = undefined;
        user = await User.findById(req.user.id);
        let attendanceDate = await AttendanceDate.findById(req.params.id);
        if(!attendanceDate){
          throw new Error('Attendance Date Not Found');
        }
        if (user == undefined) {
          throw new Error("User not found");
        } else {
          if(user.id == attendanceDate.user){
              const updatedCheckOut = await AttendanceDate.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
              );
              res.status(200).json(updatedCheckOut);
          }else{
              res.status(401).json({message: "Unauthorized"});
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

  if(!req.query.date_filter){
    const userDates = await AttendanceDate.find({ user: req.params.id });
    if (userDates) {
      res.status(200).json(userDates);
    }
  }else{
    let endDate = addDays(req.query.end_date,1);
    let startDate = req.query.start_date;
    const userDates =
     await AttendanceDate.find({
      createdAt : {$gte: startDate, $lte : endDate}});
      res.status(200).json(userDates);
  }
});




module.exports = {
  checkIn,
  getUserDates,
  checkOut
};
