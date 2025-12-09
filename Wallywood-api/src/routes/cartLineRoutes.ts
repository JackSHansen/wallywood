import { Router } from 'express';
import {
  getUserCart,
  addToCart,
  updateCartLine,
  deleteCartLine
} from '../controllers/cartLineController.js';
import { authenticate } from '../middleware/auth.js';

export const cartLineRoutes = Router();

cartLineRoutes.get('/', authenticate, getUserCart);
cartLineRoutes.post('/', authenticate, addToCart);
cartLineRoutes.put('/:id', authenticate, updateCartLine);
cartLineRoutes.delete('/:id', authenticate, deleteCartLine);
