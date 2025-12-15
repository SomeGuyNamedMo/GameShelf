import { Router } from 'express';
import * as bggController from '../controllers/bgg.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All BGG routes require authentication
router.use(authMiddleware);

// GET /api/bgg/search
router.get('/search', bggController.search);

// GET /api/bgg/game/:bggId
router.get('/game/:bggId', bggController.getGameDetails);

export default router;

