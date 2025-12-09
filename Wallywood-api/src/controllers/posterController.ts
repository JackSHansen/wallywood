import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPosters = async (req: Request, res: Response) => {
  try {
    const posters = await prisma.poster.findMany({
      include: {
        genrePosterRels: {
          include: {
            genre: true
          }
        }
      }
    });
    res.json(posters);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPosterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const poster = await prisma.poster.findUnique({
      where: { id: Number(id) },
      include: {
        genrePosterRels: {
          include: {
            genre: true
          }
        }
      }
    });
    
    if (!poster) {
      return res.status(404).json({ message: 'Poster not found' });
    }
    
    res.json(poster);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPoster = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, image, width, height, price, stock, genreIds } = req.body;
    
    const poster = await prisma.poster.create({
      data: {
        name,
        slug,
        description,
        image,
        width,
        height,
        price,
        stock,
        genrePosterRels: genreIds ? {
          create: genreIds.map((genreId: number) => ({ genreId }))
        } : undefined
      },
      include: {
        genrePosterRels: {
          include: {
            genre: true
          }
        }
      }
    });
    
    res.status(201).json(poster);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePoster = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, width, height, price, stock } = req.body;
    
    const poster = await prisma.poster.update({
      where: { id: Number(id) },
      data: {
        name,
        slug,
        description,
        image,
        width,
        height,
        price,
        stock
      }
    });
    
    res.json(poster);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePoster = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.poster.delete({
      where: { id: Number(id) }
    });
    
    res.json({ message: 'Poster deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
