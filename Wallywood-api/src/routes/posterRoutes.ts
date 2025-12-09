import { Router } from 'express';
import {
  getAllPosters,
  getPosterById,
  createPoster,
  updatePoster,
  deletePoster
} from '../controllers/posterController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const posterRoutes = Router();

posterRoutes.get('/', getAllPosters);
posterRoutes.get('/:id', getPosterById);
posterRoutes.post('/', authenticate, requireAdmin, createPoster);
posterRoutes.put('/:id', authenticate, requireAdmin, updatePoster);
posterRoutes.delete('/:id', authenticate, requireAdmin, deletePoster);
