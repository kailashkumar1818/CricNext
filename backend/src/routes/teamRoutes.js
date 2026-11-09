import express from 'express';
import {
  getAllTeams,
  getTeamByIdOrCode,
  getAllPlayers,
  getPlayerById,
} from '../controllers/teamController.js';

const router = express.Router();

router.get('/', getAllTeams);
router.get('/players/all', getAllPlayers);
router.get('/players/:id', getPlayerById);
router.get('/:idOrCode', getTeamByIdOrCode);

export default router;
