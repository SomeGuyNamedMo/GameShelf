/**
 * Natural Language Search Query Parser
 * 
 * Parses queries like:
 * - "2 player games"
 * - "games under 30 minutes"
 * - "strategy games for 4 players"
 * - "quick 2-player games"
 */

export interface ParsedQuery {
  textQuery: string | null;
  playerCount: number | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  maxPlaytime: number | null;
  minPlaytime: number | null;
  categories: string[];
  status: string | null;
}

// Common category keywords
const CATEGORY_KEYWORDS = [
  'strategy',
  'party',
  'family',
  'cooperative',
  'coop',
  'co-op',
  'card',
  'dice',
  'abstract',
  'war',
  'wargame',
  'economic',
  'euro',
  'adventure',
  'puzzle',
  'trivia',
  'word',
  'dexterity',
  'fantasy',
  'sci-fi',
  'horror',
  'racing',
  'fighting',
  'civilization',
  'area control',
  'deck building',
  'worker placement',
  'engine building',
];

// Status keywords
const STATUS_KEYWORDS: Record<string, string> = {
  available: 'AVAILABLE',
  'on shelf': 'AVAILABLE',
  borrowed: 'BORROWED',
  'lent out': 'BORROWED',
  storage: 'STORAGE',
  'in storage': 'STORAGE',
  stored: 'STORAGE',
};

// Time unit multipliers (to minutes)
const TIME_UNITS: Record<string, number> = {
  min: 1,
  mins: 1,
  minute: 1,
  minutes: 1,
  m: 1,
  hour: 60,
  hours: 60,
  hr: 60,
  hrs: 60,
  h: 60,
};

export function parseSearchQuery(query: string): ParsedQuery {
  const result: ParsedQuery = {
    textQuery: null,
    playerCount: null,
    minPlayers: null,
    maxPlayers: null,
    maxPlaytime: null,
    minPlaytime: null,
    categories: [],
    status: null,
  };

  if (!query.trim()) {
    return result;
  }

  const normalizedQuery = query.toLowerCase().trim();
  let remainingQuery = normalizedQuery;

  // Extract player count patterns
  // "2 player", "2-4 players", "for 3 players", "3 people"
  const playerPatterns = [
    /(\d+)\s*-\s*(\d+)\s*(?:player|players|people|p)/i,
    /(?:for\s+)?(\d+)\s*(?:player|players|people|p)(?:\s+game)?/i,
    /(\d+)\s*-\s*(\d+)\s*p\b/i,
  ];

  for (const pattern of playerPatterns) {
    const match = remainingQuery.match(pattern);
    if (match) {
      if (match[2]) {
        // Range like "2-4 players"
        result.minPlayers = parseInt(match[1], 10);
        result.maxPlayers = parseInt(match[2], 10);
        result.playerCount = result.minPlayers;
      } else {
        // Single number like "2 players"
        result.playerCount = parseInt(match[1], 10);
      }
      remainingQuery = remainingQuery.replace(match[0], ' ').trim();
      break;
    }
  }

  // Extract playtime patterns
  // "under 30 min", "30 minutes or less", "quick", "short", "long"
  const timePatterns = [
    /(?:under|less than|max|maximum|<)\s*(\d+)\s*(min|mins|minute|minutes|hour|hours|hr|hrs|h|m)?/i,
    /(\d+)\s*(min|mins|minute|minutes|hour|hours|hr|hrs|h|m)?\s*(?:or less|max)/i,
    /(?:at least|minimum|more than|>)\s*(\d+)\s*(min|mins|minute|minutes|hour|hours|hr|hrs|h|m)?/i,
  ];

  for (const pattern of timePatterns) {
    const match = remainingQuery.match(pattern);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2]?.toLowerCase() || 'min';
      const multiplier = TIME_UNITS[unit] || 1;
      const minutes = value * multiplier;
      
      if (pattern.source.includes('at least|minimum|more than')) {
        result.minPlaytime = minutes;
      } else {
        result.maxPlaytime = minutes;
      }
      remainingQuery = remainingQuery.replace(match[0], ' ').trim();
      break;
    }
  }

  // Quick/short/long modifiers
  if (/\b(quick|fast|short|filler)\b/i.test(remainingQuery)) {
    if (!result.maxPlaytime) {
      result.maxPlaytime = 30;
    }
    remainingQuery = remainingQuery.replace(/\b(quick|fast|short|filler)\b/gi, ' ').trim();
  }

  if (/\b(long|epic|marathon)\b/i.test(remainingQuery)) {
    if (!result.minPlaytime) {
      result.minPlaytime = 120;
    }
    remainingQuery = remainingQuery.replace(/\b(long|epic|marathon)\b/gi, ' ').trim();
  }

  // Extract status
  for (const [keyword, status] of Object.entries(STATUS_KEYWORDS)) {
    if (remainingQuery.includes(keyword)) {
      result.status = status;
      remainingQuery = remainingQuery.replace(keyword, ' ').trim();
      break;
    }
  }

  // Extract categories
  for (const category of CATEGORY_KEYWORDS) {
    const regex = new RegExp(`\\b${category}\\b`, 'i');
    if (regex.test(remainingQuery)) {
      result.categories.push(category);
      remainingQuery = remainingQuery.replace(regex, ' ').trim();
    }
  }

  // Clean up remaining query for text search
  remainingQuery = remainingQuery
    .replace(/\b(game|games|for|and|the|a|an)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (remainingQuery) {
    result.textQuery = remainingQuery;
  }

  return result;
}

/**
 * Generate a human-readable description of the parsed query
 */
export function describeQuery(parsed: ParsedQuery): string {
  const parts: string[] = [];

  if (parsed.playerCount) {
    parts.push(`${parsed.playerCount} players`);
  } else if (parsed.minPlayers && parsed.maxPlayers) {
    parts.push(`${parsed.minPlayers}-${parsed.maxPlayers} players`);
  }

  if (parsed.maxPlaytime) {
    parts.push(`under ${parsed.maxPlaytime} minutes`);
  } else if (parsed.minPlaytime) {
    parts.push(`at least ${parsed.minPlaytime} minutes`);
  }

  if (parsed.categories.length > 0) {
    parts.push(parsed.categories.join(', '));
  }

  if (parsed.status) {
    parts.push(parsed.status.toLowerCase());
  }

  if (parsed.textQuery) {
    parts.push(`"${parsed.textQuery}"`);
  }

  return parts.join(' • ') || 'All games';
}

export default parseSearchQuery;

