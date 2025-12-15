import { Router } from 'express';
import * as gameController from '../controllers/game.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireAdmin, requireMember, requireGuest } from '../middleware/rbac.middleware.js';

const router = Router();

// All game routes require authentication
router.use(authMiddleware);

// GET /api/libraries/:libraryId/games
router.get('/:libraryId/games', requireGuest, gameController.getGames);

// POST /api/libraries/:libraryId/games
router.post('/:libraryId/games', requireMember, gameController.createGame);

// GET /api/libraries/:libraryId/games/:gameId
router.get('/:libraryId/games/:gameId', requireGuest, gameController.getGame);

// PATCH /api/libraries/:libraryId/games/:gameId
router.patch('/:libraryId/games/:gameId', requireMember, gameController.updateGame);

// DELETE /api/libraries/:libraryId/games/:gameId
router.delete('/:libraryId/games/:gameId', requireAdmin, gameController.deleteGame);

export default router;

