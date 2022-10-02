const asyncHandler  = require('express-async-handler');
const {Leave} = require('../models/leave_model');
const { getAllPreviousDatesByDays, getLastDate } = require('../utils/date_formatter');

const getLeavesOfTheWeek = asyncHandler(async (req, res) => {
    let dates = [];
    let leaves = [0,0,0,0,0,0,0];
    let now = new Date;
    dates = getAllPreviousDatesByDays(7);
    const queryLeaves = await Leave.aggregate([
        {
            $addFields : {
                convertedDate: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }},
            },
        },
        {
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
        }
    ]);

    if(queryLeaves){
        queryLeaves.forEach((queryLeave) => {
           dates.forEach((date) => {
             if(date === queryLeave._id.date){
                let index = dates.indexOf(date);
                leaves[index] = queryLeave.count;
            }
           })
        });

        res.status(200).json({dates, leaves});
    }else{
        res.status(400);
        throw new Error("Error fetching leaves");
    }
});

module.exports = {
    getLeavesOfTheWeek,
}