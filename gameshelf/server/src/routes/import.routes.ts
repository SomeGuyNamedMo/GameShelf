import { Router } from 'express';
import * as importController from '../controllers/import.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireMember } from '../middleware/rbac.middleware.js';

const router = Router();

// All import routes require authentication
router.use(authMiddleware);

// POST /api/import/preview - Preview bulk import (parse and match)
router.post('/preview', importController.previewBulkImport);

// GET /api/import/search - Search games for autocomplete
router.get('/search', importController.searchGames);

// POST /api/libraries/:libraryId/import/bulk - Confirm and import games
router.post('/libraries/:libraryId/bulk', requireMember, importController.confirmBulkImport);

// POST /api/libraries/:libraryId/import/bgg - Sync with BGG account
router.post('/libraries/:libraryId/bgg', requireMember, importController.syncWithBgg);

export default router;

