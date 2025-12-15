import { Router } from 'express';
import * as playlistController from '../controllers/playlist.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireMember, requireGuest } from '../middleware/rbac.middleware.js';

const router = Router();

// All playlist routes require authentication
router.use(authMiddleware);

// GET /api/libraries/:libraryId/playlists
router.get('/:libraryId/playlists', requireGuest, playlistController.getPlaylists);

// POST /api/libraries/:libraryId/playlists
router.post('/:libraryId/playlists', requireMember, playlistController.createPlaylist);

export default router;

