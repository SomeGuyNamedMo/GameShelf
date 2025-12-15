import { Router } from 'express';
import authRoutes from './auth.routes.js';
import libraryRoutes from './library.routes.js';
import gameRoutes from './game.routes.js';
import borrowRoutes from './borrow.routes.js';
import libraryBorrowRoutes from './libraryBorrow.routes.js';
import playlistRoutes from './playlist.routes.js';
import playlistItemRoutes from './playlistItem.routes.js';
import bggRoutes from './bgg.routes.js';
import importRoutes from './import.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/libraries', libraryRoutes);
router.use('/libraries', gameRoutes);
router.use('/libraries', libraryBorrowRoutes);
router.use('/libraries', playlistRoutes);
router.use('/borrow', borrowRoutes);
router.use('/playlists', playlistItemRoutes);
router.use('/bgg', bggRoutes);
router.use('/import', importRoutes);

export default router;

