const mongoose = require("mongoose");
const Joi = require("joi");
const { userSchema } = require("../schemas/user_schema.js");

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    first_name: Joi.string().min(1).max(50).required(),
    last_name: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(5).max(50).required().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirmPassword: Joi.ref("password"),
    gender: Joi.string().allow(null),
    phone: Joi.string().min(10).max(15).required(),
    // role: Joi.string().required().allow(null).allow(""),
    address: Joi.string().min(5).max(50).required().allow("").allow(null),
    job_title: Joi.string().required().allow(null).allow(""),
    imgUrl: Joi.string().allow(null).allow(""),
    status: Joi.string().allow(null).allow(""),
  });

  const validate = schema.validate(user);
  console.log(validate);
  return validate;
}

function validateUserLogins(userLogins) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    device_token: Joi.string().allow(null).allow(""),
  });

  const validate = schema.validate(userLogins);
  return validate;
}

module.exports = {
  User,
  validateUser,
  validateUserLogins,
};
