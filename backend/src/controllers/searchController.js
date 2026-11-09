import { Team } from '../models/Team.js';
import { Player } from '../models/Player.js';
import { News } from '../models/News.js';

// @desc    Global search across teams, players, and news
// @route   GET /api/search
// @access  Public
export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(200).json({
        success: true,
        query: '',
        results: {
          teams: [],
          players: [],
          news: [],
        },
      });
    }

    const regex = new RegExp(q.trim(), 'i');

    const [teams, players, news] = await Promise.all([
      Team.find({
        $or: [{ name: regex }, { code: regex }],
      })
        .select('name code logoUrl ranking captain')
        .limit(6),

      Player.find({
        $or: [{ name: regex }, { teamName: regex }, { teamCode: regex }, { role: regex }],
      })
        .select('name teamName teamCode role avatarUrl')
        .limit(8),

      News.find({
        $or: [{ title: regex }, { summary: regex }, { tags: { $in: [regex] } }],
      })
        .select('title slug summary category imageUrl publishedAt')
        .limit(6),
    ]);

    res.status(200).json({
      success: true,
      query: q.trim(),
      counts: {
        total: teams.length + players.length + news.length,
        teams: teams.length,
        players: players.length,
        news: news.length,
      },
      results: {
        teams,
        players,
        news,
      },
    });
  } catch (error) {
    next(error);
  }
};
