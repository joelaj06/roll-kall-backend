const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name : String,
  last_name : String,
  email : String, 
  password : String,
  phone : String , 
  role : {
    type : mongoose.SchemaTypes.ObjectId,
    ref : 'Role'
  },
  address : String, 
  date_of_birth : Date,
  programme : String,
  status : String,
  level : String, 
  tokens : [{type : Object}],
  work_id : String,
  imgUrl : String,
  gender : String,
  job_title : String,

},{
  timestamps: true
});


/* 
 unpopulated user
  {
    _id : 46458668464654,
    name : "John Doe ",
    "level ": 200,
    attendance_date : ObjectId("4564213216112112");
  }

  populated user 
  {
    _id : 45461321651,
    name : "John Doe",
    level : 200,
    ...
    attendance_date :[ {
      _id : "43132151546116555",
      check_in : "15: 03",
      check_out : "",
      location : "JW43-T Santa Maria - Accra ",
      date : "Fri Sep 09 2022 19:36:46 GMT+0000"
    },...
  ]
  }
*/

module.exports.userSchema = userSchema;