const asyncHandler = require('express-async-handler');
const {Team} = require('../models/team_model')


//@desc Get all available teams
//@route GET /api/teams
//@access PRIVATE
const getTeams = asyncHandler(async(req, res) => {
    if(!req.params.id){
        const page = req.query.page;
        const limit = req.query.limit;
        const startIndex = (page - 1) * limit;
        const teams = await Team.find({}).populate('members', '-password')
        .limit(limit).skip(startIndex);
        if(teams){
            res.status(200).json(teams);
        }
    }else{
        const team = await Team.findById(req.params.id).populate('members', '-password')
        .limit(limit).skip(startIndex);
        if(team){
            res.status(200).json(team);
        }else{
            res.status(400);
            throw new Error('No team found');
        }
       
    }
})

//@desc Create team
//@route POST /api/teams
//@access PRIVATE
const addTeam = asyncHandler( async(req, res) => {
    const {name, members , status, notes, code} = req.body;
    const team = new Team({name, members, status, notes, code});
    await team.save();
    if(team){
        res.status(201).json(team);
    }else{
        res.status(400);
        throw new Error('Failed to save team');
    }
})


//@desc Update team
//@route PUT /api/teams/:id
//@access PRIVATE
const updateTeam = asyncHandler(async(req, res) => {  
        const team = await Team.findById(req.params.id);
        if(team){
            const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body,
                 {new : true});
            if(updatedTeam){
                res.status(200).json(updatedTeam);
            }else{
                res.status(400);
                throw new Error('Failed to update team');
            }
            
        }else{
            res.status(400);
            throw new Error('Team not found')
        }
   
})


//@desc Delete team
//@route DELETE /api/teams/:id
//@access PRIVATE
const deleteTeam = asyncHandler(async(req, res) => {
    const team = await Team.findById(req.params.id);
    if(team){
        await team.remove();
        res.status(200).json({id : req.params.id})
    }else{
        res.status(400);
        throw new Error('Team not found')
    }
})



module.exports = {getTeams, addTeam, updateTeam, deleteTeam}