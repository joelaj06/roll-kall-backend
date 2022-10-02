const asyncHandler = require("express-async-handler");
const { AttendanceDate } = require("../models/attendance_date_model");
const { getLastDate, getPreviousDateByDays } = require("../utils/date_formatter");

//@desc get weekly report of active users
//@route GET /api/getUsersOfTheWeek
//@access PRIVATE

const getUsersOfTheWeek = asyncHandler(async (req, res) => {
    
    let unsortedUsers = []
    let dates = [];
    let users = [0,0,0,0,0,0,0];

    let now  = new Date();
    
    dates.push(now.toISOString().split('T')[0]);

    for(i = 1; i < 7; i++){
        dates.push(getPreviousDateByDays(now, i))
    }

  const activeUsers = await AttendanceDate.aggregate([
    {
      $addFields: {
        convertedDate: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }},
      },
    },

    {
      // Each _id must be unique, so if there are multiple
      // documents with th same _id, Mongodb will increment
      $match: {
        createdAt: {
          $gte: getLastDate(now, 7),
        },
      },
    },
    {
      $group: {
        _id: {
          date: "$convertedDate",
        },
        count: { $sum: 1 },
      },
    },

    { $sort: { convertedDate: 1 } },
  ]);

  if (activeUsers) {
    activeUsers.map((activeUser) => {
        unsortedUsers.push(activeUser.count);
      
    });

   // let users = unsortedUsers.sort(function(a, b){return a - b})

   activeUsers.forEach((activeUser) => {
    dates.forEach((date) => {
      if(date === activeUser._id.date){
        let index = dates.indexOf(date);
        users[index] = activeUser.count;
      }
    })
  })

    res.status(200).json({dates, users});
  } else {
    throw new Error("Error fetching data");
  }
});

module.exports = {
  getUsersOfTheWeek,
};
