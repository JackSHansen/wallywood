import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        genrePosterRels: {
          include: {
            poster: true
          }
        }
      }
    });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGenreById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const genre = await prisma.genre.findUnique({
      where: { id: Number(id) },
      include: {
        genrePosterRels: {
          include: {
            poster: true
          }
        }
      }
    });
    
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }
    
    res.json(genre);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createGenre = async (req: Request, res: Response) => {
  try {
    const { title, slug } = req.body;
    
    const genre = await prisma.genre.create({
      data: {
        title,
        slug
      }
    });
    
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug } = req.body;
    
    const genre = await prisma.genre.update({
      where: { id: Number(id) },
      data: {
        title,
        slug
      }
    });
    
    res.json(genre);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.genre.delete({
      where: { id: Number(id) }
    });
    
    res.json({ message: 'Genre deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
