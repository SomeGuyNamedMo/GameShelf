import { Router } from 'express';
import * as borrowController from '../controllers/borrow.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireMember } from '../middleware/rbac.middleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/libraries/:libraryId/borrows
router.get('/:libraryId/borrows', requireMember, borrowController.getLibraryBorrows);

export default router;

