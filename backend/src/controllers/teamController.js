import { Team } from '../models/Team.js';
import { Player } from '../models/Player.js';

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ 'ranking.test': 1 });
    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team by ID or Code, including squad players
// @route   GET /api/teams/:idOrCode
// @access  Public
export const getTeamByIdOrCode = async (req, res, next) => {
  try {
    const { idOrCode } = req.params;

    let team;
    if (idOrCode.match(/^[0-9a-fA-F]{24}$/)) {
      team = await Team.findById(idOrCode);
    } else {
      team = await Team.findOne({ code: idOrCode.toUpperCase() });
    }

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    // Fetch players belonging to this team
    const players = await Player.find({
      $or: [{ teamId: team._id }, { teamCode: team.code }],
    }).sort({ role: 1, name: 1 });

    res.status(200).json({
      success: true,
      team,
      players,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all players with optional team filter
// @route   GET /api/teams/players/all
// @access  Public
export const getAllPlayers = async (req, res, next) => {
  try {
    const { teamCode, role } = req.query;
    const filter = {};

    if (teamCode) {
      filter.teamCode = teamCode.toUpperCase();
    }
    if (role) {
      filter.role = role;
    }

    const players = await Player.find(filter).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: players.length,
      players,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single player profile with full stats
// @route   GET /api/teams/players/:id
// @access  Public
export const getPlayerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found',
      });
    }

    res.status(200).json({
      success: true,
      player,
    });
  } catch (error) {
    next(error);
  }
};
