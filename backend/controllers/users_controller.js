const asyncHandler = require('express-async-handler');
const {User, validateUser} = require('../models/user')


const getUsers = asyncHandler(async (req, res) =>{
    const users = await User.find();
    res.status(200).json(users);
})

const addUser = asyncHandler(async (req, res) =>{
    const {error} = validateUser(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        if(error.details[0].message == 'confirmPassword" must be [ref:password]'){
            res.status(400).send('password do not match');
        }
    }

    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).send('User already exist!');
    }else{
        user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: req.body.password,
          index_number: req.body.index_number,
          phone: req.body.phone,
          role_id: req.body.role_id,
          address: req.body.address,
          date_of_birth: req.body.date_of_birth,
          programme: req.body.programme,
          level: req.body.level,
        });

        await user.save();
        res.send(user);
    }
})

const updateUser = asyncHandler( async (req, res) =>{
    let user = undefined;
    try {
         user = await User.findById(req.params.id);
    } catch (error) {
        //console.log(error)
    }
    if(user==undefined){
        res.status(400); 
        throw new Error("User not found");
    }else{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, 
            {new : true});
            res.status(200).json(updatedUser);
    }
    
})

const deleteUser = asyncHandler(async (req, res) =>{
    const user = await User.findById(req.params.id);
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    await User.deleteOne(user);
    res.status(200).json({id: req.params.id});
})

module.exports = {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
}