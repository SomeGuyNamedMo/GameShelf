import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { GameStatus } from '@prisma/client';
import * as gameService from '../services/game.service.js';

const createGameSchema = z.object({
  bggId: z.number().optional(),
  title: z.string().min(1, 'Title is required'),
  coverUrl: z.string().url().optional(),
  minPlayers: z.number().int().positive().optional(),
  maxPlayers: z.number().int().positive().optional(),
  playtimeMin: z.number().int().positive().optional(),
  playtimeMax: z.number().int().positive().optional(),
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
  mechanics: z.array(z.string()).optional(),
  location: z.string().optional(),
});

const updateGameSchema = z.object({
  title: z.string().min(1).optional(),
  coverUrl: z.string().url().optional().nullable(),
  minPlayers: z.number().int().positive().optional(),
  maxPlayers: z.number().int().positive().optional(),
  playtimeMin: z.number().int().positive().optional().nullable(),
  playtimeMax: z.number().int().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  categories: z.array(z.string()).optional(),
  mechanics: z.array(z.string()).optional(),
  location: z.string().optional().nullable(),
  status: z.enum(['AVAILABLE', 'BORROWED', 'STORAGE']).optional(),
  rating: z.number().min(0).max(5).optional().nullable(),
});

const querySchema = z.object({
  q: z.string().optional(),
  status: z.enum(['AVAILABLE', 'BORROWED', 'STORAGE']).optional(),
  location: z.string().optional(),
  minPlayers: z.coerce.number().int().positive().optional(),
  maxPlayers: z.coerce.number().int().positive().optional(),
  maxPlaytime: z.coerce.number().int().positive().optional(),
  category: z.string().optional(),
  sort: z.enum(['title', 'rating', 'lastPlayed', 'playtime']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export async function getGames(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId } = req.params;
    const filters = querySchema.parse(req.query);
    
    const result = await gameService.getLibraryGames(libraryId, {
      ...filters,
      status: filters.status as GameStatus | undefined,
    });
    
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId, gameId } = req.params;
    const game = await gameService.getGameById(gameId, libraryId);
    res.json(game);
  } catch (error) {
    next(error);
  }
}

export async function createGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId } = req.params;
    const input = createGameSchema.parse(req.body);
    const game = await gameService.createGame(libraryId, input);
    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
}

export async function updateGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId, gameId } = req.params;
    const input = updateGameSchema.parse(req.body);
    const game = await gameService.updateGame(gameId, libraryId, {
      ...input,
      status: input.status as GameStatus | undefined,
    });
    res.json(game);
  } catch (error) {
    next(error);
  }
}

export async function deleteGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId, gameId } = req.params;
    await gameService.deleteGame(gameId, libraryId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

