import { GameStatus, Prisma } from '@prisma/client';

interface SearchFilters {
  q?: string;
  status?: GameStatus;
  location?: string;
  minPlayers?: number;
  maxPlayers?: number;
  maxPlaytime?: number;
  category?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

interface ParsedQuery {
  playerCount?: number;
  maxPlaytime?: number;
  keywords: string[];
}

// Parse natural language queries like "2 player under 30 min"
function parseNaturalLanguageQuery(query: string): ParsedQuery {
  const result: ParsedQuery = { keywords: [] };
  
  // Match player count patterns
  const playerPatterns = [
    /(\d+)\s*player/i,
    /(\d+)\s*p\b/i,
    /for\s*(\d+)/i,
  ];
  
  for (const pattern of playerPatterns) {
    const match = query.match(pattern);
    if (match) {
      result.playerCount = parseInt(match[1], 10);
      query = query.replace(match[0], '');
      break;
    }
  }
  
  // Match time patterns
  const timePatterns = [
    /under\s*(\d+)\s*min/i,
    /less\s*than\s*(\d+)\s*min/i,
    /(\d+)\s*min(?:utes?)?\s*or\s*less/i,
    /max\s*(\d+)\s*min/i,
    /(\d+)\s*min(?:utes?)?/i,
  ];
  
  for (const pattern of timePatterns) {
    const match = query.match(pattern);
    if (match) {
      result.maxPlaytime = parseInt(match[1], 10);
      query = query.replace(match[0], '');
      break;
    }
  }
  
  // Remaining words become keywords
  result.keywords = query
    .split(/\s+/)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 2);
  
  return result;
}

export function buildGameFilters(
  libraryId: string,
  filters: SearchFilters
): Prisma.GameWhereInput {
  const where: Prisma.GameWhereInput = {
    libraryId,
  };

  // Handle natural language query
  if (filters.q) {
    const parsed = parseNaturalLanguageQuery(filters.q);
    
    if (parsed.playerCount) {
      where.minPlayers = { lte: parsed.playerCount };
      where.maxPlayers = { gte: parsed.playerCount };
    }
    
    if (parsed.maxPlaytime) {
      where.playtimeMax = { lte: parsed.maxPlaytime };
    }
    
    if (parsed.keywords.length > 0) {
      where.OR = parsed.keywords.map((keyword) => ({
        OR: [
          { title: { contains: keyword, mode: 'insensitive' as const } },
          { description: { contains: keyword, mode: 'insensitive' as const } },
          { categories: { has: keyword } },
          { mechanics: { has: keyword } },
        ],
      }));
    }
  }

  // Explicit filters
  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.location) {
    where.location = { contains: filters.location, mode: 'insensitive' };
  }

  if (filters.minPlayers) {
    where.minPlayers = { lte: filters.minPlayers };
    where.maxPlayers = { gte: filters.minPlayers };
  }

  if (filters.maxPlayers) {
    where.maxPlayers = { lte: filters.maxPlayers };
  }

  if (filters.maxPlaytime) {
    where.playtimeMax = { lte: filters.maxPlaytime };
  }

  if (filters.category) {
    where.categories = { has: filters.category };
  }

  return where;
}

export function buildGameOrderBy(
  sort?: string,
  order: 'asc' | 'desc' = 'asc'
): Prisma.GameOrderByWithRelationInput {
  switch (sort) {
    case 'title':
      return { title: order };
    case 'rating':
      return { rating: order };
    case 'lastPlayed':
      return { lastPlayedAt: order };
    case 'playtime':
      return { playtimeMax: order };
    default:
      return { title: 'asc' };
  }
}

