import { Router } from 'express';
import {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
} from '../controllers/genreController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const genreRoutes = Router();

// Public Routes
genreRoutes.get('/', getAllGenres); // Get all genres
genreRoutes.get('/:id', getGenreById); // Get genre by ID

// Admin Routes
genreRoutes.post('/', authenticate, requireAdmin, createGenre); // Create a new genre
genreRoutes.put('/:id', authenticate, requireAdmin, updateGenre); // Update genre by ID
genreRoutes.delete('/:id', authenticate, requireAdmin, deleteGenre); // Delete genre by ID
