const asyncHandler = require("express-async-handler");
const { Team } = require("../models/team_model");

//@desc Get all available teams
//@route GET /api/teams
//@access PRIVATE
const getTeams = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchQuery = req.query.search || "";
  const startIndex = (page - 1) * limit;

  try {
    if (!req.params.id) {
      // For all teams with pagination

      let query = {};
      if (searchQuery) {
        query = {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on team name
          ],
        };
      }
      const totalCount = await Team.countDocuments(query);
      const teams = await Team.find(query)
        .populate("members", "-password -tokens")
        .limit(limit)
        .skip(startIndex);

      const totalPages = Math.ceil(totalCount / limit);

      res.set(
        "x-pagination",
        JSON.stringify({
          totalPages,
          pageCount: page,
          totalCount,
        })
      );

      if (teams) {
        res.status(200).json(teams);
      } else {
        res.status(400);
        throw new Error("Failed to fetch teams");
      }
    } else {
      // For a specific team
      const team = await Team.findById(req.params.id).populate(
        "members",
        "-password -tokens"
      );

      if (team) {
        res.status(200).json(team);
      } else {
        res.status(400);
        throw new Error("No team found");
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@desc Create team
//@route POST /api/teams
//@access PRIVATE
const addTeam = asyncHandler(async (req, res) => {
  const { name, members, status, notes, code } = req.body;
  const team = new Team({ name, members, status, notes, code });
  await team.save();
  if (team) {
    res.status(201).json(team);
  } else {
    res.status(400);
    throw new Error("Failed to save team");
  }
});

//@desc Update team
//@route PUT /api/teams/:id
//@access PRIVATE
const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (team) {
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedTeam) {
      res.status(200).json(updatedTeam);
    } else {
      res.status(400);
      throw new Error("Failed to update team");
    }
  } else {
    res.status(400);
    throw new Error("Team not found");
  }
});

//@desc Delete team
//@route DELETE /api/teams/:id
//@access PRIVATE
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (team) {
    try {
      await Team.findByIdAndDelete(req.params.id);
      res.status(200).json({ _id: req.params.id });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  } else {
    res.status(400);
    throw new Error("Team not found");
  }
});

module.exports = { getTeams, addTeam, updateTeam, deleteTeam };
