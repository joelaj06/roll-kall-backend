const asyncHandler = require("express-async-handler");
const { Role } = require("../models/role.js");

//@desc fetch roles of all users
//@route GET /api/roles
//@access PRIVATE
const getRoles = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    const roles = await Role.find();
    res.status(200).json({ roles });
  } else {
    const role = await Role.findById(req.params.id);
    res.status(200).json( role );
  }
});

//@desc add a role
//@route POST /api/roles
//@access PRIVATE
const addRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;
  const role = new Role({ name, permissions });
  await role.save();
  if (role) {
    res.status(200).json(role);
  } else {
    res.status(400);
    throw new Error("Failed to add role");
  }
});

//@desc update a roles
//@route GET /api/roles/:id
//@access PRIVATE
const updateRole = asyncHandler(async (req, res) => {
    let role;
    try{
         role = await Role.findById(req.params.id);
    }catch(err){
        res.status(400)
        throw new Error('Role not found');
    }
  if (role) {
    const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedRole);
  } else {
    res.status(400);
    throw new Error("Failed to update role");
  }
});

//@desc update a roles
//@route GET /api/roles/:id
//@access PRIVATE
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (role) {
    await Role.deleteOne(role);
    res.status(200).json(req.params.id);
  } else {
    res.status(400);
    throw new Error("Role not found");
  }
});

module.exports = {
  addRole,
  getRoles,
  updateRole,
  deleteRole,
};
