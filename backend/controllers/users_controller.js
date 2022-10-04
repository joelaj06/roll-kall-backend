const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const {
  User,
  validateUser,
  validateUserLogins,
} = require("../models/user_model");
const { getRandomValues } = require("crypto");

// @desc Get all users
// @route GET /api/users
// @access Private
const getUsers = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    const users = await User.find().select("-password").populate("role");
    res.status(200).json(users);
  } else {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      throw new Error("User not found");
    }
  }
});

// @desc Register user
// @route POST /api/users
// @access Private
const addUser = asyncHandler(async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exist!" });
    } else {
      // hashing password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
        index_number: req.body.index_number,
        phone: req.body.phone,
        role: req.body.role,
        address: req.body.address,
        date_of_birth: req.body.date_of_birth,
        programme: req.body.programme,
        level: req.body.level,
        imgUrl : req.body.imgUrl,
        gender : req.body.gender
      });

      await user.save();

      if (user) {
        res.status(201).json({
          _id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          index_number: user.index_number,
          phone: user.phone,
          role: user.role,
          address: user.address,
          date_of_birth: user.date_of_birth,
          programme: user.programme,
          level: user.level,
          gender : user.gender,
          imgUrl : user.imgUrl,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("Invalid user");
      }
    }
  }
});

// @desc Authenticate a user
// @route GET /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { error } = validateUserLogins(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {

      const token = generateToken(user._id);
      
      let oldTokens = user.tokens || [];

      if(oldTokens.length){
        oldTokens = oldTokens.filter((token) => {
          const timeDiff = (Date.now() - parseInt(token.signedAt))/1000;
          if(timeDiff < 86400){
            return token;
          }
        })
      }

      await User.findByIdAndUpdate(user._id, {
        tokens: [...oldTokens,{token, signedAt: Date.now().toString() }],
      }).populate("role");
      res.status(201).json({
        _id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        index_number: user.index_number,
        phone: user.phone,
        role: user.role,
        address: user.address,
        date_of_birth: user.date_of_birth,
        programme: user.programme,
        level: user.level,
        token: token,
      });
      
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  }
});

// @desc Get user data
// @route GET /api/users/user
// @access Private
const getUser = asyncHandler(async (req, res) => {
  const {
    _id,
    first_name,
    last_name,
    email,
    index_number,
    phone,
    role,
    address,
    date_of_birth,
    programme,
    level,
  } = await User.findById(req.user.id).populate("role");

  res.status(200).json({
    id: _id,
    first_name: first_name,
    last_name: last_name,
    email: email,
    index_number: index_number,
    phone: phone,
    role: role,
    address: address,
    date_of_birth: date_of_birth,
    programme: programme,
    level: level,
  });
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  let user = undefined;
  try {
    user = await User.findById(req.params.id);
  } catch (error) {
    console.log(error);
  }
  if (user == undefined) {
    res.status(400);
    throw new Error("User not found");
  } else {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      _id: updatedUser.id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      index_number: updatedUser.index_number,
      phone: updatedUser.phone,
      role: updatedUser.role,
      address: updatedUser.address,
      date_of_birth: updatedUser.date_of_birth,
      programme: updatedUser.programme,
      level: updatedUser.level,
    });
  }
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  await user.remove();
  res.status(200).json({ id: req.params.id });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETE, {
    expiresIn: "1d",
  });
};


const logout = asyncHandler( async(req, res) => {
   if(req.headers && req.headers.authorization){
    let token = req.headers.authorization.split(' ')[1];
    if(!token){
      return res.status(401).json({message: 'Authorization failed'});
    }else{
      const tokens = req.user.tokens;
      const newTokens = tokens.filter((t) => {
        t.token != token;
      });

      await User.findByIdAndUpdate(req.user._id, {tokens : newTokens});

      res.status(200).json({message: 'User logged out successfully'})
    }
   }
})
module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  getUser,
  logout
};


