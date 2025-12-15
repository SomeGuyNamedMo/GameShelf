import { Router } from 'express';
import * as playlistController from '../controllers/playlist.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/playlists/:playlistId
router.get('/:playlistId', playlistController.getPlaylist);

// POST /api/playlists/:playlistId/games
router.post('/:playlistId/games', playlistController.addGameToPlaylist);

// DELETE /api/playlists/:playlistId/games/:gameId
router.delete('/:playlistId/games/:gameId', playlistController.removeGameFromPlaylist);

export default router;

