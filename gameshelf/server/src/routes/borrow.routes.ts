import { Router } from 'express';
import * as borrowController from '../controllers/borrow.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireMember } from '../middleware/rbac.middleware.js';

const router = Router();

// All borrow routes require authentication
router.use(authMiddleware);

// POST /api/borrow/games/:gameId/checkout
router.post('/games/:gameId/checkout', borrowController.checkout);

// POST /api/borrow/games/:gameId/return
router.post('/games/:gameId/return', borrowController.returnGame);

// GET /api/borrow/active
router.get('/active', borrowController.getActiveBorrows);

export default router;

