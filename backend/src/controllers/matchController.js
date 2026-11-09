import { cricketApiService } from '../services/cricketApiService.js';

// @desc    Get all current live matches
// @route   GET /api/matches/live
// @access  Public
export const getLiveMatches = async (req, res, next) => {
  try {
    const liveMatches = await cricketApiService.getLiveMatches();
    res.status(200).json({
      success: true,
      count: liveMatches.length,
      matches: liveMatches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent completed match results
// @route   GET /api/matches/recent
// @access  Public
export const getRecentMatches = async (req, res, next) => {
  try {
    const recent = await cricketApiService.getRecentMatches();
    res.status(200).json({
      success: true,
      count: recent.length,
      matches: recent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming fixtures / schedule with series and team filters
// @route   GET /api/matches/schedule
// @access  Public
export const getSchedule = async (req, res, next) => {
  try {
    const { team, series } = req.query;
    const schedule = await cricketApiService.getUpcomingMatches(team, series);
    res.status(200).json({
      success: true,
      count: schedule.length,
      matches: schedule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed live score & ball-by-ball commentary for a match
// @route   GET /api/matches/:id/live
// @access  Public
export const getLiveMatchDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const match = await cricketApiService.getMatchById(id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match details not found',
      });
    }

    res.status(200).json({
      success: true,
      match,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete batting & bowling scorecard for a match
// @route   GET /api/matches/:id/scorecard
// @access  Public
export const getMatchScorecard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scorecard = await cricketApiService.getMatchScorecard(id);

    if (!scorecard) {
      return res.status(404).json({
        success: false,
        message: 'Scorecard not found',
      });
    }

    res.status(200).json({
      success: true,
      scorecard,
    });
  } catch (error) {
    next(error);
  }
};
