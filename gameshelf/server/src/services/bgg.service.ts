import { AppError } from '../lib/errors.js';

interface BggSearchResult {
  bggId: number;
  title: string;
  yearPublished: number | null;
  thumbnailUrl: string | null;
}

interface BggGameDetails {
  bggId: number;
  title: string;
  description: string;
  yearPublished: number | null;
  coverUrl: string | null;
  minPlayers: number;
  maxPlayers: number;
  playtimeMin: number | null;
  playtimeMax: number | null;
  categories: string[];
  mechanics: string[];
  bggRating: number | null;
}

const BGG_API_BASE = 'https://boardgamegeek.com/xmlapi2';

// Simple XML parser for BGG responses
function extractTagContent(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function extractAttribute(xml: string, attr: string): string | null {
  const regex = new RegExp(`${attr}="([^"]*)"`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : null;
}

function extractAllTags(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'gi');
  const matches = xml.matchAll(regex);
  return Array.from(matches, (m) => m[1].trim());
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#10;/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#[0-9]+;/g, (match) => {
      const code = parseInt(match.slice(2, -1), 10);
      return String.fromCharCode(code);
    });
}

export async function searchBgg(query: string): Promise<BggSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  const url = `${BGG_API_BASE}/search?query=${encodeURIComponent(query)}&type=boardgame`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw AppError.internal('Failed to search BoardGameGeek');
  }

  const xml = await response.text();
  
  // Parse search results from XML
  const results: BggSearchResult[] = [];
  const itemRegex = /<item type="boardgame" id="(\d+)">([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const bggId = parseInt(match[1], 10);
    const itemXml = match[2];
    
    const titleMatch = itemXml.match(/<name type="primary" value="([^"]*)"/);
    const yearMatch = itemXml.match(/<yearpublished value="(\d+)"/);

    if (titleMatch) {
      results.push({
        bggId,
        title: decodeHtmlEntities(titleMatch[1]),
        yearPublished: yearMatch ? parseInt(yearMatch[1], 10) : null,
        thumbnailUrl: null, // Not available in search results
      });
    }
  }

  return results.slice(0, 20); // Limit to 20 results
}

export async function getBggGameDetails(bggId: number): Promise<BggGameDetails> {
  const url = `${BGG_API_BASE}/thing?id=${bggId}&stats=1`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw AppError.internal('Failed to fetch game from BoardGameGeek');
  }

  const xml = await response.text();
  
  // Check if game exists
  if (xml.includes('<items total="0">')) {
    throw AppError.notFound('Game not found on BoardGameGeek');
  }

  // Extract basic info
  const titleMatch = xml.match(/<name type="primary"[^>]*value="([^"]*)"/);
  const title = titleMatch ? decodeHtmlEntities(titleMatch[1]) : 'Unknown';

  const descriptionMatch = xml.match(/<description>([^<]*)<\/description>/);
  const description = descriptionMatch 
    ? decodeHtmlEntities(descriptionMatch[1]) 
    : '';

  const yearMatch = xml.match(/<yearpublished value="(\d+)"/);
  const yearPublished = yearMatch ? parseInt(yearMatch[1], 10) : null;

  const imageMatch = xml.match(/<image>([^<]*)<\/image>/);
  const coverUrl = imageMatch ? imageMatch[1] : null;

  const minPlayersMatch = xml.match(/<minplayers value="(\d+)"/);
  const minPlayers = minPlayersMatch ? parseInt(minPlayersMatch[1], 10) : 1;

  const maxPlayersMatch = xml.match(/<maxplayers value="(\d+)"/);
  const maxPlayers = maxPlayersMatch ? parseInt(maxPlayersMatch[1], 10) : 4;

  const minPlaytimeMatch = xml.match(/<minplaytime value="(\d+)"/);
  const playtimeMin = minPlaytimeMatch ? parseInt(minPlaytimeMatch[1], 10) : null;

  const maxPlaytimeMatch = xml.match(/<maxplaytime value="(\d+)"/);
  const playtimeMax = maxPlaytimeMatch ? parseInt(maxPlaytimeMatch[1], 10) : null;

  // Extract categories
  const categories: string[] = [];
  const categoryRegex = /<link type="boardgamecategory"[^>]*value="([^"]*)"/gi;
  let catMatch;
  while ((catMatch = categoryRegex.exec(xml)) !== null) {
    categories.push(decodeHtmlEntities(catMatch[1]));
  }

  // Extract mechanics
  const mechanics: string[] = [];
  const mechanicRegex = /<link type="boardgamemechanic"[^>]*value="([^"]*)"/gi;
  let mechMatch;
  while ((mechMatch = mechanicRegex.exec(xml)) !== null) {
    mechanics.push(decodeHtmlEntities(mechMatch[1]));
  }

  // Extract rating
  const ratingMatch = xml.match(/<average value="([^"]*)"/);
  const bggRating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

  return {
    bggId,
    title,
    description,
    yearPublished,
    coverUrl,
    minPlayers,
    maxPlayers,
    playtimeMin,
    playtimeMax,
    categories,
    mechanics,
    bggRating: bggRating ? Math.round(bggRating * 10) / 10 : null,
  };
}

