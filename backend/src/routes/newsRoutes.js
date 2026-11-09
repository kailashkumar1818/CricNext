import express from 'express';
import {
  getNews,
  getTopNews,
  getNewsBySlugOrId,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/newsController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getNews);
router.get('/top', getTopNews);
router.get('/:slugOrId', getNewsBySlugOrId);

// Protected Admin routes
router.post('/', protect, requireAdmin, createNews);
router.put('/:id', protect, requireAdmin, updateNews);
router.delete('/:id', protect, requireAdmin, deleteNews);

export default router;
