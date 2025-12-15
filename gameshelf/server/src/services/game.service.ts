import { GameStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';
import { buildGameFilters, buildGameOrderBy } from './search.service.js';

interface CreateGameInput {
  bggId?: number;
  title: string;
  coverUrl?: string;
  minPlayers?: number;
  maxPlayers?: number;
  playtimeMin?: number;
  playtimeMax?: number;
  description?: string;
  categories?: string[];
  mechanics?: string[];
  location?: string;
}

interface UpdateGameInput {
  title?: string;
  coverUrl?: string;
  minPlayers?: number;
  maxPlayers?: number;
  playtimeMin?: number;
  playtimeMax?: number;
  description?: string;
  categories?: string[];
  mechanics?: string[];
  location?: string;
  status?: GameStatus;
  rating?: number;
}

interface GameFilters {
  q?: string;
  status?: GameStatus;
  location?: string;
  minPlayers?: number;
  maxPlayers?: number;
  maxPlaytime?: number;
  category?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export async function getLibraryGames(libraryId: string, filters: GameFilters) {
  const where = buildGameFilters(libraryId, filters);
  const orderBy = buildGameOrderBy(filters.sort, filters.order);

  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { expansions: true },
        },
      },
    }),
    prisma.game.count({ where }),
  ]);

  return {
    games: games.map((game) => ({
      id: game.id,
      bggId: game.bggId,
      title: game.title,
      coverUrl: game.coverUrl,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      playtimeMin: game.playtimeMin,
      playtimeMax: game.playtimeMax,
      description: game.description,
      categories: game.categories,
      mechanics: game.mechanics,
      location: game.location,
      status: game.status,
      rating: game.rating,
      timesPlayed: game.timesPlayed,
      lastPlayedAt: game.lastPlayedAt,
      expansionCount: game._count.expansions,
    })),
    total,
  };
}

export async function getGameById(gameId: string, libraryId: string) {
  const game = await prisma.game.findFirst({
    where: { id: gameId, libraryId },
    include: {
      expansions: {
        select: {
          id: true,
          name: true,
          owned: true,
        },
      },
      borrows: {
        orderBy: { borrowedAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!game) {
    throw AppError.notFound('Game not found');
  }

  return {
    id: game.id,
    bggId: game.bggId,
    title: game.title,
    coverUrl: game.coverUrl,
    minPlayers: game.minPlayers,
    maxPlayers: game.maxPlayers,
    playtimeMin: game.playtimeMin,
    playtimeMax: game.playtimeMax,
    description: game.description,
    categories: game.categories,
    mechanics: game.mechanics,
    location: game.location,
    status: game.status,
    rating: game.rating,
    timesPlayed: game.timesPlayed,
    lastPlayedAt: game.lastPlayedAt,
    createdAt: game.createdAt,
    expansions: game.expansions,
    borrowHistory: game.borrows.map((borrow) => ({
      id: borrow.id,
      borrower: borrow.user,
      borrowedAt: borrow.borrowedAt,
      returnedAt: borrow.returnedAt,
    })),
  };
}

export async function createGame(libraryId: string, input: CreateGameInput) {
  const game = await prisma.game.create({
    data: {
      libraryId,
      bggId: input.bggId,
      title: input.title,
      coverUrl: input.coverUrl,
      minPlayers: input.minPlayers ?? 1,
      maxPlayers: input.maxPlayers ?? 4,
      playtimeMin: input.playtimeMin,
      playtimeMax: input.playtimeMax,
      description: input.description,
      categories: input.categories ?? [],
      mechanics: input.mechanics ?? [],
      location: input.location,
    },
  });

  return game;
}

export async function updateGame(
  gameId: string,
  libraryId: string,
  input: UpdateGameInput
) {
  // Verify game exists in library
  const existing = await prisma.game.findFirst({
    where: { id: gameId, libraryId },
  });

  if (!existing) {
    throw AppError.notFound('Game not found');
  }

  const game = await prisma.game.update({
    where: { id: gameId },
    data: input,
  });

  return game;
}

export async function deleteGame(gameId: string, libraryId: string) {
  // Verify game exists in library
  const existing = await prisma.game.findFirst({
    where: { id: gameId, libraryId },
  });

  if (!existing) {
    throw AppError.notFound('Game not found');
  }

  await prisma.game.delete({
    where: { id: gameId },
  });
}

