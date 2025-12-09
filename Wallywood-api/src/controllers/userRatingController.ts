import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const getAllRatings = async (req: Request, res: Response) => {
  try {
    const ratings = await prisma.userRating.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true
          }
        },
        poster: true
      }
    });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRatingsByPosterId = async (req: Request, res: Response) => {
  try {
    const { posterId } = req.params;
    const ratings = await prisma.userRating.findMany({
      where: { posterId: Number(posterId) },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true
          }
        }
      }
    });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createRating = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { posterId, numStars } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (numStars < 1 || numStars > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const rating = await prisma.userRating.create({
      data: {
        userId,
        posterId,
        numStars
      },
      include: {
        poster: true
      }
    });
    
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRating = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { numStars } = req.body;
    const userId = req.user?.id;
    
    if (numStars < 1 || numStars > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Verify rating belongs to user
    const rating = await prisma.userRating.findUnique({
      where: { id: Number(id) }
    });
    
    if (!rating || rating.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    const updated = await prisma.userRating.update({
      where: { id: Number(id) },
      data: { numStars },
      include: {
        poster: true
      }
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRating = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    // Verify rating belongs to user or user is admin
    const rating = await prisma.userRating.findUnique({
      where: { id: Number(id) }
    });
    
    if (!rating || (rating.userId !== userId && req.user?.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await prisma.userRating.delete({
      where: { id: Number(id) }
    });
    
    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
