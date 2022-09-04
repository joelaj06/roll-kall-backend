const mongoose = require('mongoose');
const Joi = require('joi');
const{ userSchema }= require('../schemas/user_schema.js');

const User = mongoose.model('User', userSchema);

function validateUser(user){
    
    const schema =  Joi.object({
        first_name : Joi.string().min(1).max(50).required(),
        last_name : Joi.string().min(1).max(50).required(),
        email : Joi.string().min(5).max(50).required().email().required(), 
        password :  Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        confirmPassword: Joi.ref('password'),
        index_number : Joi.string().min(5).max(50).required(), 
        phone : Joi.string().min(10).max(15).required() , 
        role_id : Joi.number().required(),
        address : Joi.string().min(5).max(50).required(), 
        programme : Joi.string().min(5).max(50).required(),
        level : Joi.string().min(1).max(50).required(), 
    }
);

  const validate = schema.validate(user);
  console.log(validate);
  return validate;
    
}

module.exports.User = User;
module.exports.validateUser = validateUser;