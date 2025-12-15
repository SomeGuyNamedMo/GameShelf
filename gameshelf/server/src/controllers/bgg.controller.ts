import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as bggService from '../services/bgg.service.js';

const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
});

const bggIdSchema = z.object({
  bggId: z.coerce.number().int().positive(),
});

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = searchSchema.parse(req.query);
    const results = await bggService.searchBgg(q);
    res.json({ results });
  } catch (error) {
    next(error);
  }
}

export async function getGameDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const { bggId } = bggIdSchema.parse(req.params);
    const game = await bggService.getBggGameDetails(bggId);
    res.json(game);
  } catch (error) {
    next(error);
  }
}

