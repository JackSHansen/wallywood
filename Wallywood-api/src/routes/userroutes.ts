import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/usercontroller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const userRoutes = Router();

userRoutes.get('/', authenticate, requireAdmin, getAllUsers);
userRoutes.get('/:id', authenticate, getUserById);
userRoutes.put('/:id', authenticate, updateUser);
userRoutes.delete('/:id', authenticate, requireAdmin, deleteUser);