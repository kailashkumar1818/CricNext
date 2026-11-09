import { cricketApiService } from '../services/cricketApiService.js';

// @desc    Get ICC Rankings for Test, ODI, and T20
// @route   GET /api/rankings
// @access  Public
export const getRankings = async (req, res, next) => {
  try {
    const { format } = req.query; // 'test', 'odi', 't20'
    const allRankings = await cricketApiService.getIccRankings();

    if (format && allRankings[format.toLowerCase()]) {
      return res.status(200).json({
        success: true,
        format: format.toLowerCase(),
        rankings: allRankings[format.toLowerCase()],
      });
    }

    res.status(200).json({
      success: true,
      rankings: allRankings,
    });
  } catch (error) {
    next(error);
  }
};
