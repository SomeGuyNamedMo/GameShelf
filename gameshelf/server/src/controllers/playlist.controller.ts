import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';
import { buildGameFilters } from '../services/search.service.js';

const createPlaylistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.string().optional(),
  isSmartList: z.boolean().default(false),
  smartCriteria: z.object({
    status: z.enum(['AVAILABLE', 'BORROWED', 'STORAGE']).optional(),
    minPlayers: z.number().int().positive().optional(),
    maxPlayers: z.number().int().positive().optional(),
    maxPlaytime: z.number().int().positive().optional(),
    category: z.string().optional(),
  }).optional(),
});

const addGameSchema = z.object({
  gameId: z.string().min(1, 'Game ID is required'),
});

export async function getPlaylists(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId } = req.params;

    const playlists = await prisma.playlist.findMany({
      where: { libraryId },
      include: {
        _count: {
          select: { games: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // For smart lists, we need to count matching games
    const result = await Promise.all(
      playlists.map(async (playlist) => {
        let gameCount = playlist._count.games;

        if (playlist.isSmartList && playlist.smartCriteria) {
          const criteria = playlist.smartCriteria as Record<string, unknown>;
          const where = buildGameFilters(libraryId, criteria);
          gameCount = await prisma.game.count({ where });
        }

        return {
          id: playlist.id,
          name: playlist.name,
          icon: playlist.icon,
          isSmartList: playlist.isSmartList,
          ...(playlist.isSmartList && { smartCriteria: playlist.smartCriteria }),
          gameCount,
        };
      })
    );

    res.json({ playlists: result });
  } catch (error) {
    next(error);
  }
}

export async function createPlaylist(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId } = req.params;
    const input = createPlaylistSchema.parse(req.body);

    const playlist = await prisma.playlist.create({
      data: {
        libraryId,
        name: input.name,
        icon: input.icon,
        isSmartList: input.isSmartList,
        smartCriteria: input.isSmartList ? input.smartCriteria : undefined,
      },
    });

    res.status(201).json({
      id: playlist.id,
      name: playlist.name,
      icon: playlist.icon,
      isSmartList: playlist.isSmartList,
      ...(playlist.isSmartList && { smartCriteria: playlist.smartCriteria }),
    });
  } catch (error) {
    next(error);
  }
}

export async function getPlaylist(req: Request, res: Response, next: NextFunction) {
  try {
    const { playlistId } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        games: {
          include: {
            game: {
              select: {
                id: true,
                title: true,
                coverUrl: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!playlist) {
      throw AppError.notFound('Playlist not found');
    }

    let games;
    
    if (playlist.isSmartList && playlist.smartCriteria) {
      // For smart lists, fetch games matching criteria
      const criteria = playlist.smartCriteria as Record<string, unknown>;
      const where = buildGameFilters(playlist.libraryId, criteria);
      
      const matchingGames = await prisma.game.findMany({
        where,
        select: {
          id: true,
          title: true,
          coverUrl: true,
        },
        orderBy: { title: 'asc' },
      });
      
      games = matchingGames.map((g, index) => ({
        id: g.id,
        title: g.title,
        coverUrl: g.coverUrl,
        order: index,
      }));
    } else {
      games = playlist.games.map((pg) => ({
        id: pg.game.id,
        title: pg.game.title,
        coverUrl: pg.game.coverUrl,
        order: pg.order,
      }));
    }

    res.json({
      id: playlist.id,
      name: playlist.name,
      icon: playlist.icon,
      isSmartList: playlist.isSmartList,
      games,
    });
  } catch (error) {
    next(error);
  }
}

export async function addGameToPlaylist(req: Request, res: Response, next: NextFunction) {
  try {
    const { playlistId } = req.params;
    const { gameId } = addGameSchema.parse(req.body);

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw AppError.notFound('Playlist not found');
    }

    if (playlist.isSmartList) {
      throw AppError.validation('Cannot manually add games to a smart playlist');
    }

    // Get max order
    const maxOrder = await prisma.playlistGame.aggregate({
      where: { playlistId },
      _max: { order: true },
    });

    const playlistGame = await prisma.playlistGame.create({
      data: {
        playlistId,
        gameId,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    res.status(201).json({
      playlistId: playlistGame.playlistId,
      gameId: playlistGame.gameId,
      order: playlistGame.order,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeGameFromPlaylist(req: Request, res: Response, next: NextFunction) {
  try {
    const { playlistId, gameId } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw AppError.notFound('Playlist not found');
    }

    if (playlist.isSmartList) {
      throw AppError.validation('Cannot manually remove games from a smart playlist');
    }

    await prisma.playlistGame.delete({
      where: {
        playlistId_gameId: {
          playlistId,
          gameId,
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

