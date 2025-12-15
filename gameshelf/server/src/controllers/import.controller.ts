import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { parseGameList, matchGameList, importGamesToLibrary } from '../services/import.service.js';
import { loginToBgg, fetchBggCollection, fetchBggGameDetails } from '../services/bgg-auth.service.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

// Schema for bulk import preview
const bulkImportSchema = z.object({
  content: z.string().min(1, 'Game list content is required'),
});

// Schema for confirming import
const confirmImportSchema = z.object({
  games: z.array(z.object({
    bggId: z.number().optional(),
    title: z.string(),
    coverUrl: z.string().optional(),
    minPlayers: z.number().optional(),
    maxPlayers: z.number().optional(),
    playtimeMin: z.number().optional(),
    playtimeMax: z.number().optional(),
    description: z.string().optional(),
    categories: z.array(z.string()).optional(),
    mechanics: z.array(z.string()).optional(),
  })),
});

// Schema for BGG sync
const bggSyncSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  importOwned: z.boolean().default(true),
  importWantToPlay: z.boolean().default(false),
});

// Simple in-memory game database for matching (would be replaced with real DB)
// This is a sample - in production, load from a file or database
const GAME_DATABASE = [
  { bggId: 266192, title: 'Wingspan', yearPublished: 2019 },
  { bggId: 167791, title: 'Terraforming Mars', yearPublished: 2016 },
  { bggId: 174430, title: 'Gloomhaven', yearPublished: 2017 },
  { bggId: 224517, title: 'Brass: Birmingham', yearPublished: 2018 },
  { bggId: 162886, title: 'Spirit Island', yearPublished: 2017 },
  { bggId: 169786, title: 'Scythe', yearPublished: 2016 },
  { bggId: 193738, title: 'Great Western Trail', yearPublished: 2016 },
  { bggId: 182028, title: 'Through the Ages: A New Story of Civilization', yearPublished: 2015 },
  { bggId: 187645, title: 'Star Wars: Rebellion', yearPublished: 2016 },
  { bggId: 233078, title: 'Twilight Imperium: Fourth Edition', yearPublished: 2017 },
  { bggId: 220308, title: 'Gaia Project', yearPublished: 2017 },
  { bggId: 251247, title: 'Barrage', yearPublished: 2019 },
  { bggId: 312484, title: 'Lost Ruins of Arnak', yearPublished: 2020 },
  { bggId: 342942, title: 'Ark Nova', yearPublished: 2021 },
  { bggId: 291457, title: 'Gloomhaven: Jaws of the Lion', yearPublished: 2020 },
  { bggId: 295486, title: 'My City', yearPublished: 2020 },
  { bggId: 284083, title: 'The Crew: The Quest for Planet Nine', yearPublished: 2019 },
  { bggId: 246900, title: 'Eclipse: Second Dawn for the Galaxy', yearPublished: 2020 },
  { bggId: 68448, title: '7 Wonders', yearPublished: 2010 },
  { bggId: 173346, title: '7 Wonders Duel', yearPublished: 2015 },
  { bggId: 36218, title: 'Dominion', yearPublished: 2008 },
  { bggId: 148228, title: 'Splendor', yearPublished: 2014 },
  { bggId: 13, title: 'Catan', yearPublished: 1995 },
  { bggId: 30549, title: 'Pandemic', yearPublished: 2008 },
  { bggId: 822, title: 'Carcassonne', yearPublished: 2000 },
  { bggId: 2651, title: 'Power Grid', yearPublished: 2004 },
  { bggId: 28720, title: 'Brass: Lancashire', yearPublished: 2007 },
  { bggId: 31260, title: 'Agricola', yearPublished: 2007 },
  { bggId: 12333, title: 'Twilight Struggle', yearPublished: 2005 },
  { bggId: 120677, title: 'Terra Mystica', yearPublished: 2012 },
  { bggId: 161936, title: 'Pandemic Legacy: Season 1', yearPublished: 2015 },
  { bggId: 84876, title: 'The Castles of Burgundy', yearPublished: 2011 },
  { bggId: 35677, title: 'Le Havre', yearPublished: 2008 },
  { bggId: 102794, title: 'Caverna: The Cave Farmers', yearPublished: 2013 },
  { bggId: 171623, title: 'The Voyages of Marco Polo', yearPublished: 2015 },
  { bggId: 199792, title: 'Everdell', yearPublished: 2018 },
  { bggId: 175914, title: 'Food Chain Magnate', yearPublished: 2015 },
  { bggId: 205637, title: 'Arkham Horror: The Card Game', yearPublished: 2016 },
  { bggId: 164928, title: 'Orléans', yearPublished: 2014 },
  { bggId: 230802, title: 'Azul', yearPublished: 2017 },
  { bggId: 256960, title: 'Pax Pamir: Second Edition', yearPublished: 2019 },
  { bggId: 276025, title: 'Maracaibo', yearPublished: 2019 },
  { bggId: 281259, title: 'The Isle of Cats', yearPublished: 2019 },
  { bggId: 366013, title: 'Heat: Pedal to the Metal', yearPublished: 2022 },
  { bggId: 317985, title: 'Beyond the Sun', yearPublished: 2020 },
  { bggId: 329082, title: 'Unconscious Mind', yearPublished: 2022 },
  { bggId: 324856, title: 'Dune: Imperium', yearPublished: 2020 },
];

// Preview bulk import - parse and match games
export async function previewBulkImport(req: Request, res: Response, next: NextFunction) {
  try {
    const { content } = bulkImportSchema.parse(req.body);
    
    // Parse the game list
    const gameNames = parseGameList(content);
    
    if (gameNames.length === 0) {
      throw AppError.validation('No games found in the provided content');
    }
    
    // Match against our database
    const preview = await matchGameList(gameNames, GAME_DATABASE);
    
    res.json(preview);
  } catch (error) {
    next(error);
  }
}

// Confirm and execute bulk import
export async function confirmBulkImport(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId } = req.params;
    const { games } = confirmImportSchema.parse(req.body);
    
    if (games.length === 0) {
      throw AppError.validation('No games to import');
    }
    
    // Import games to library
    const result = await importGamesToLibrary(libraryId, games);
    
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

// Sync with BGG account
export async function syncWithBgg(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId } = req.params;
    const { username, password, importOwned, importWantToPlay } = bggSyncSchema.parse(req.body);
    
    // Login to BGG
    const session = await loginToBgg({ username, password });
    
    // Fetch collection
    const collection = await fetchBggCollection(session, {
      own: importOwned,
      wantToPlay: importWantToPlay,
    });
    
    if (collection.length === 0) {
      return res.json({
        imported: 0,
        message: 'No games found in your BGG collection with the selected filters',
      });
    }
    
    // Filter to owned games if requested
    const gamesToImport = collection.filter(game => {
      if (importOwned && game.status.own) return true;
      if (importWantToPlay && game.status.wantToPlay) return true;
      return false;
    });
    
    // Check for duplicates (games already in library by BGG ID)
    const existingGames = await prisma.game.findMany({
      where: {
        libraryId,
        bggId: { in: gamesToImport.map(g => g.bggId) },
      },
      select: { bggId: true },
    });
    const existingBggIds = new Set(existingGames.map(g => g.bggId));
    
    const newGames = gamesToImport.filter(g => !existingBggIds.has(g.bggId));
    
    if (newGames.length === 0) {
      return res.json({
        imported: 0,
        skipped: gamesToImport.length,
        message: 'All games from your BGG collection are already in this library',
      });
    }
    
    // Import new games
    const result = await importGamesToLibrary(
      libraryId,
      newGames.map(game => ({
        bggId: game.bggId,
        title: game.title,
        coverUrl: game.coverUrl,
        minPlayers: game.minPlayers,
        maxPlayers: game.maxPlayers,
        playtimeMin: game.playtimeMin,
        playtimeMax: game.playtimeMax,
      }))
    );
    
    res.status(201).json({
      ...result,
      skipped: existingBggIds.size,
      message: `Imported ${result.imported} games from BGG`,
    });
  } catch (error) {
    next(error);
  }
}

// Search for game autocomplete
export async function searchGames(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req.query.q as string || '').toLowerCase().trim();
    
    if (query.length < 2) {
      return res.json({ results: [] });
    }
    
    // Search local database
    const results = GAME_DATABASE
      .filter(game => game.title.toLowerCase().includes(query))
      .slice(0, 10)
      .map(game => ({
        bggId: game.bggId,
        title: game.title,
        yearPublished: game.yearPublished,
      }));
    
    res.json({ results });
  } catch (error) {
    next(error);
  }
}

