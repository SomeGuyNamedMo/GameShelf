import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

interface GameMatch {
  input: string;
  matched: boolean;
  confidence: number;
  game?: {
    bggId: number;
    title: string;
    yearPublished?: number;
    coverUrl?: string;
    minPlayers?: number;
    maxPlayers?: number;
    playtimeMin?: number;
    playtimeMax?: number;
  };
  suggestions?: Array<{
    bggId: number;
    title: string;
    yearPublished?: number;
  }>;
}

interface ImportPreview {
  total: number;
  matched: number;
  unmatched: number;
  games: GameMatch[];
}

// Simple fuzzy matching score (0-1)
function fuzzyScore(input: string, target: string): number {
  const a = input.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  
  // Exact match
  if (a === b) return 1;
  
  // Contains match
  if (b.includes(a) || a.includes(b)) return 0.8;
  
  // Word overlap
  const aWords = new Set(a.split(/\s+/));
  const bWords = new Set(b.split(/\s+/));
  const intersection = [...aWords].filter(w => bWords.has(w));
  const union = new Set([...aWords, ...bWords]);
  const jaccard = intersection.length / union.size;
  
  return jaccard * 0.7;
}

// Parse uploaded game list (supports various formats)
export function parseGameList(content: string): string[] {
  const lines = content
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !line.startsWith('#')); // Skip comments
  
  // Handle CSV format (take first column)
  if (lines[0]?.includes(',')) {
    return lines.map(line => {
      const parts = line.split(',');
      return parts[0].replace(/^["']|["']$/g, '').trim();
    }).filter(Boolean);
  }
  
  // Handle numbered lists: "1. Game Name" or "1) Game Name"
  return lines.map(line => {
    return line.replace(/^\d+[\.\)]\s*/, '').trim();
  }).filter(Boolean);
}

// Match a list of game names against a game database
export async function matchGameList(
  gameNames: string[],
  gameDatabase: Array<{ bggId: number; title: string; yearPublished?: number }>
): Promise<ImportPreview> {
  const results: GameMatch[] = [];
  
  for (const input of gameNames) {
    // Find best matches
    const scores = gameDatabase
      .map(game => ({
        game,
        score: fuzzyScore(input, game.title),
      }))
      .filter(r => r.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    if (scores.length > 0 && scores[0].score >= 0.7) {
      // High confidence match
      results.push({
        input,
        matched: true,
        confidence: scores[0].score,
        game: {
          bggId: scores[0].game.bggId,
          title: scores[0].game.title,
          yearPublished: scores[0].game.yearPublished,
        },
        suggestions: scores.slice(1, 4).map(s => ({
          bggId: s.game.bggId,
          title: s.game.title,
          yearPublished: s.game.yearPublished,
        })),
      });
    } else if (scores.length > 0) {
      // Low confidence - needs review
      results.push({
        input,
        matched: false,
        confidence: scores[0].score,
        suggestions: scores.map(s => ({
          bggId: s.game.bggId,
          title: s.game.title,
          yearPublished: s.game.yearPublished,
        })),
      });
    } else {
      // No matches found
      results.push({
        input,
        matched: false,
        confidence: 0,
      });
    }
  }
  
  return {
    total: results.length,
    matched: results.filter(r => r.matched).length,
    unmatched: results.filter(r => !r.matched).length,
    games: results,
  };
}

// Import confirmed games into a library
export async function importGamesToLibrary(
  libraryId: string,
  games: Array<{
    bggId?: number;
    title: string;
    coverUrl?: string;
    minPlayers?: number;
    maxPlayers?: number;
    playtimeMin?: number;
    playtimeMax?: number;
    description?: string;
    categories?: string[];
    mechanics?: string[];
  }>
) {
  const created = await prisma.$transaction(
    games.map(game => 
      prisma.game.create({
        data: {
          libraryId,
          bggId: game.bggId,
          title: game.title,
          coverUrl: game.coverUrl,
          minPlayers: game.minPlayers ?? 1,
          maxPlayers: game.maxPlayers ?? 4,
          playtimeMin: game.playtimeMin,
          playtimeMax: game.playtimeMax,
          description: game.description,
          categories: game.categories ?? [],
          mechanics: game.mechanics ?? [],
        },
      })
    )
  );
  
  return {
    imported: created.length,
    games: created,
  };
}

