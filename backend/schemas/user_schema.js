const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name : String,
  last_name : String,
  email : String, 
  password : String,
  index_number : String, 
  phone : String , 
  role_id : Number,
  address : String, 
  date_of_birth : Date,
  programme : String,
  level : String, 
  // createdAt : {
  //   type : Date,
  //   default : Date.now
  // }, 
  
},{
  timestamps: true
});


module.exports.userSchema = userSchema;