import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

const checkoutSchema = z.object({
  dueAt: z.string().datetime().optional(),
});

export async function checkout(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;
    const userId = req.user!.id;
    const { dueAt } = checkoutSchema.parse(req.body);

    // Get game and verify it's available
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { library: true },
    });

    if (!game) {
      throw AppError.notFound('Game not found');
    }

    if (game.status !== 'AVAILABLE') {
      throw AppError.conflict('Game is not available for borrowing');
    }

    // Verify user is a member of the library
    const membership = await prisma.libraryMember.findUnique({
      where: {
        userId_libraryId: {
          userId,
          libraryId: game.libraryId,
        },
      },
    });

    if (!membership) {
      throw AppError.forbidden('You are not a member of this library');
    }

    // Create borrow record and update game status
    const [borrow] = await prisma.$transaction([
      prisma.borrow.create({
        data: {
          gameId,
          userId,
          dueAt: dueAt ? new Date(dueAt) : undefined,
        },
      }),
      prisma.game.update({
        where: { id: gameId },
        data: { status: 'BORROWED' },
      }),
    ]);

    res.json({
      id: borrow.id,
      gameId: borrow.gameId,
      gameTitle: game.title,
      borrowedAt: borrow.borrowedAt,
      dueAt: borrow.dueAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function returnGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;
    const userId = req.user!.id;

    // Find active borrow
    const borrow = await prisma.borrow.findFirst({
      where: {
        gameId,
        userId,
        returnedAt: null,
      },
    });

    if (!borrow) {
      throw AppError.notFound('No active borrow found for this game');
    }

    // Update borrow and game status
    const [updatedBorrow] = await prisma.$transaction([
      prisma.borrow.update({
        where: { id: borrow.id },
        data: { returnedAt: new Date() },
      }),
      prisma.game.update({
        where: { id: gameId },
        data: { status: 'AVAILABLE' },
      }),
    ]);

    res.json({
      id: updatedBorrow.id,
      gameId: updatedBorrow.gameId,
      returnedAt: updatedBorrow.returnedAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function getActiveBorrows(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const borrows = await prisma.borrow.findMany({
      where: {
        userId,
        returnedAt: null,
      },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            library: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { borrowedAt: 'desc' },
    });

    res.json({
      borrows: borrows.map((b) => ({
        id: b.id,
        game: {
          id: b.game.id,
          title: b.game.title,
          coverUrl: b.game.coverUrl,
        },
        library: b.game.library,
        borrowedAt: b.borrowedAt,
        dueAt: b.dueAt,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function getLibraryBorrows(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId } = req.params;

    const borrows = await prisma.borrow.findMany({
      where: {
        game: { libraryId },
        returnedAt: null,
      },
      include: {
        game: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { borrowedAt: 'desc' },
    });

    res.json({
      borrows: borrows.map((b) => ({
        id: b.id,
        game: b.game,
        borrower: b.user,
        borrowedAt: b.borrowedAt,
        dueAt: b.dueAt,
      })),
    });
  } catch (error) {
    next(error);
  }
}

