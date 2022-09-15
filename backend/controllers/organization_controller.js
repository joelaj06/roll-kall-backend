const e = require('express');
const asyncHandler = require('express-async-handler');
const {Organization} = require('../models/organization_model');


//@desc fetch organization data
//@route GET /api/organization
//@access PRIVATE
const getOrganization = asyncHandler( async(req, res) => {
    const organization = await Organization.find();
    if(organization){
        res.status(200).json(organization);     
    }else{
        res.status(400);
        throw new Error('Organization not found');
    }
});


//@desc add an organization 
//@route POST /api/organization
//@access PRIVATE
const addOrganization = asyncHandler( async(req, res) => {
    const {name, code, description, location, arrival_time,
    departure_time, logo, motto, } = req.body;
        const organization = new Organization({
            name, 
            code, 
            description, 
            location,
            arrival_time,
            departure_time, 
            logo,
            motto,
        });

        await organization.save();
        if(organization){
            res.status(201).json(organization);
        }else{
            res.status(400);
            throw new Error("Failed to add organization");
        }
});


//@desc update organization data
//@route PUT /api/organization/:id
//@access PRIVATE
const updateOrganization = asyncHandler( async(req, res) => {
  const organization = await Organization.findById(req.params.id);
  if(organization){
    const updateOrganization = await Organization.findByIdAndUpdate(
        req.params.id, req.body, {new : true}
    );

    if(updateOrganization){
        res.status(200).json(updateOrganization);
    }else{
        res.status(400);
        throw new Error('Failed to update organization');
    }
  }else{
    res.status(400);
    throw new Error('Organization not found');
  }
});


module.exports = {
    getOrganization,
    updateOrganization, 
    addOrganization
}

