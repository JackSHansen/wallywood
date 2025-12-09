import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const getUserCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const cartLines = await prisma.cartLine.findMany({
      where: { userId },
      include: {
        poster: true
      }
    });
    
    res.json(cartLines);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { posterId, quantity } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cartLine = await prisma.cartLine.create({
      data: {
        userId,
        posterId,
        quantity
      },
      include: {
        poster: true
      }
    });
    
    res.status(201).json(cartLine);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCartLine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;
    
    // Verify cart line belongs to user
    const cartLine = await prisma.cartLine.findUnique({
      where: { id: Number(id) }
    });
    
    if (!cartLine || cartLine.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    const updated = await prisma.cartLine.update({
      where: { id: Number(id) },
      data: { quantity },
      include: {
        poster: true
      }
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCartLine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    // Verify cart line belongs to user
    const cartLine = await prisma.cartLine.findUnique({
      where: { id: Number(id) }
    });
    
    if (!cartLine || cartLine.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await prisma.cartLine.delete({
      where: { id: Number(id) }
    });
    
    res.json({ message: 'Cart line deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
