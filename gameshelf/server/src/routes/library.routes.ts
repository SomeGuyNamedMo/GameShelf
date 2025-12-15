import { Router } from 'express';
import * as libraryController from '../controllers/library.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireAdmin, requireGuest } from '../middleware/rbac.middleware.js';

const router = Router();

// All library routes require authentication
router.use(authMiddleware);

// GET /api/libraries
router.get('/', libraryController.getLibraries);

// POST /api/libraries
router.post('/', libraryController.createLibrary);

// GET /api/libraries/:libraryId
router.get('/:libraryId', requireGuest, libraryController.getLibrary);

// POST /api/libraries/:libraryId/members
router.post('/:libraryId/members', requireAdmin, libraryController.inviteMember);

// PATCH /api/libraries/:libraryId/members/:userId
router.patch('/:libraryId/members/:userId', requireAdmin, libraryController.updateMemberRole);

// DELETE /api/libraries/:libraryId/members/:userId
router.delete('/:libraryId/members/:userId', requireAdmin, libraryController.removeMember);

export default router;

