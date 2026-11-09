import express from 'express';
import {
  getLiveMatches,
  getRecentMatches,
  getSchedule,
  getLiveMatchDetails,
  getMatchScorecard,
} from '../controllers/matchController.js';

const router = express.Router();

router.get('/live', getLiveMatches);
router.get('/recent', getRecentMatches);
router.get('/schedule', getSchedule);
router.get('/:id/live', getLiveMatchDetails);
router.get('/:id/scorecard', getMatchScorecard);

export default router;
