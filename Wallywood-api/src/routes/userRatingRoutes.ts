import { Router } from 'express';
import {
  getAllRatings,
  getRatingsByPosterId,
  createRating,
  updateRating,
  deleteRating
} from '../controllers/userRatingController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const userRatingRoutes = Router();

userRatingRoutes.get('/', getAllRatings);
userRatingRoutes.get('/poster/:posterId', getRatingsByPosterId);
userRatingRoutes.post('/', authenticate, createRating);
userRatingRoutes.put('/:id', authenticate, updateRating);
userRatingRoutes.delete('/:id', authenticate, deleteRating);
