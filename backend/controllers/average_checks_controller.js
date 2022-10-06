const asyncHandler = require("express-async-handler");
const { AttendanceDate } = require("../models/attendance_date_model");
const {
  getAllPreviousDatesByDays,
  getLastDate,
  changeToSeconds,
  convertToHM,
} = require("../utils/date_formatter");

let now = new Date();

//@desc get average weekly check in data
//@route GET /api/averageCheckInOfTheWeek
//@access PRIVATE
const averageCheckInOfTheWeek = asyncHandler(async (req, res) => {
  let dates = [];
  dates = getAllPreviousDatesByDays(7);

  //let avgTimes = ["00:00","00:00","00:00","00:00","00:00","00:00","00:00"];
   let avgTimes = [0,0,0,0,0,0,0];
  const attendanceDates = await AttendanceDate.find({
    createdAt: { $gte : getLastDate(now, 7)}
  });

  if (attendanceDates) {
    const checkInDates = attendanceDates.map(({check_in, createdAt}) => {
      let date = createdAt.toISOString().split("T")[0];
      let checkIn = changeToSeconds(check_in);
      return {checkIn, date}
    });

    const keys = ["date"];
    count = {};
    const results = checkInDates.reduce(function (r, o) {
      var key = keys
        .map(function (k) {
          return o[k];
        })
        .join("|");
      if (!count[key]) {
        count[key] = {
          sum: +o.checkIn,
          checkInDates: JSON.parse(JSON.stringify(o)),
        };
        count[key].checkInDates.count = 1;
        r.push(count[key].checkInDates);
      } else {
        count[key].sum += +o.checkIn;
        count[key].checkInDates.checkIn = (
          count[key].sum / ++count[key].checkInDates.count
        );
      }
      return r;
    }, []);

    const averageTimes = results.map(({checkIn, date}) => {
      let avgCheckInTime = checkIn //convertToHM(checkIn);
      return {avgCheckInTime, date};
    });

    averageTimes.forEach((averageTime) =>{
      dates.forEach((date) => {
        if(date === averageTime.date){
          let index = dates.indexOf(date);
          avgTimes[index] = averageTime.avgCheckInTime;
        }
      });
    });
    res.status(200).json({dates,avgTimes});
  }else{
    throw new Error('Failed to fetch dates')
  }
});

const averageCheckOutOfTheWeek = asyncHandler(async (req, res) => {
  let dates = [];
  dates = getAllPreviousDatesByDays(7);

 // let avgTimes = ["00:00","00:00","00:00","00:00","00:00","00:00","00:00"];
   let avgTimes = [0,0,0,0,0,0,0];
  const attendanceDates = await AttendanceDate.find({
    createdAt: { $gte : getLastDate(now, 7)}
  });

  if (attendanceDates) {
    const checkOutDates = attendanceDates.map(({check_out, createdAt}) => {
      let date = createdAt.toISOString().split("T")[0];
      let checkOut = changeToSeconds(check_out);
      return {checkOut, date}
    });

    const keys = ["date"];
    count = {};
    const results = checkOutDates.reduce(function (r, o) {
      var key = keys
        .map(function (k) {
          return o[k];
        })
        .join("|");
      if (!count[key]) {
        count[key] = {
          sum: +o.checkOut,
          checkOutDates: JSON.parse(JSON.stringify(o)),
        };
        count[key].checkOutDates.count = 1;
        r.push(count[key].checkOutDates);
      } else {
        count[key].sum += +o.checkOut;
        count[key].checkOutDates.checkOut = (
          count[key].sum / ++count[key].checkOutDates.count
        );
      }
      return r;
    }, []);

    const averageTimes = results.map(({checkOut, date}) => {
      let avgCheckOutTime = checkOut //convertToHM(checkOut);
      return {avgCheckOutTime, date};
    });

    averageTimes.forEach((averageTime) =>{
      dates.forEach((date) => {
        if(date === averageTime.date){
          let index = dates.indexOf(date);
          avgTimes[index] = averageTime.avgCheckOutTime;
        }
      });
    });
    res.status(200).json({dates,avgTimes});
  }else{
    throw new Error('Failed to fetch dates')
  }
});

module.exports = {
  averageCheckInOfTheWeek,
  averageCheckOutOfTheWeek,
};
