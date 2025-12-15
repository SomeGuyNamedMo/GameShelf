import { AppError } from '../lib/errors.js';

interface BggCredentials {
  username: string;
  password: string;
}

interface BggSession {
  cookies: string;
  username: string;
}

interface BggCollectionGame {
  bggId: number;
  title: string;
  yearPublished?: number;
  coverUrl?: string;
  thumbnailUrl?: string;
  minPlayers?: number;
  maxPlayers?: number;
  playtimeMin?: number;
  playtimeMax?: number;
  status: {
    own: boolean;
    wantToPlay: boolean;
    wantToBuy: boolean;
    wishlist: boolean;
    preordered: boolean;
  };
  numPlays: number;
  rating?: number;
}

const BGG_BASE = 'https://boardgamegeek.com';

// Login to BGG and get session cookies
export async function loginToBgg(credentials: BggCredentials): Promise<BggSession> {
  const loginUrl = `${BGG_BASE}/login/api/v1`;
  
  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      credentials: {
        username: credentials.username,
        password: credentials.password,
      },
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw AppError.unauthorized('Invalid BGG credentials');
    }
    throw AppError.internal('Failed to login to BoardGameGeek');
  }

  // Extract cookies from response
  const setCookies = response.headers.get('set-cookie');
  if (!setCookies) {
    throw AppError.internal('No session cookies received from BGG');
  }

  return {
    cookies: setCookies,
    username: credentials.username,
  };
}

// Fetch user's BGG collection with session auth
export async function fetchBggCollection(
  session: BggSession,
  options: { own?: boolean; wantToPlay?: boolean } = { own: true }
): Promise<BggCollectionGame[]> {
  const params = new URLSearchParams({
    username: session.username,
    stats: '1',
    ...(options.own && { own: '1' }),
    ...(options.wantToPlay && { wanttoplay: '1' }),
  });

  const url = `${BGG_BASE}/xmlapi2/collection?${params}`;
  
  // BGG collection requests may return 202 (queued) initially
  let attempts = 0;
  const maxAttempts = 5;
  
  while (attempts < maxAttempts) {
    const response = await fetch(url, {
      headers: {
        Cookie: session.cookies,
      },
    });

    if (response.status === 202) {
      // Request queued, wait and retry
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000));
      continue;
    }

    if (!response.ok) {
      throw AppError.internal('Failed to fetch BGG collection');
    }

    const xml = await response.text();
    return parseBggCollection(xml);
  }

  throw AppError.internal('BGG collection request timed out');
}

// Parse BGG collection XML response
function parseBggCollection(xml: string): BggCollectionGame[] {
  const games: BggCollectionGame[] = [];
  
  // Match each item in the collection
  const itemRegex = /<item[^>]*objectid="(\d+)"[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const bggId = parseInt(match[1], 10);
    const itemXml = match[2];

    // Extract fields
    const nameMatch = itemXml.match(/<name[^>]*>([^<]*)<\/name>/);
    const yearMatch = itemXml.match(/<yearpublished>(\d+)<\/yearpublished>/);
    const imageMatch = itemXml.match(/<image>([^<]*)<\/image>/);
    const thumbnailMatch = itemXml.match(/<thumbnail>([^<]*)<\/thumbnail>/);
    const numPlaysMatch = itemXml.match(/<numplays>(\d+)<\/numplays>/);
    
    // Stats
    const minPlayersMatch = itemXml.match(/<minplayers value="(\d+)"/);
    const maxPlayersMatch = itemXml.match(/<maxplayers value="(\d+)"/);
    const minPlaytimeMatch = itemXml.match(/<minplaytime value="(\d+)"/);
    const maxPlaytimeMatch = itemXml.match(/<maxplaytime value="(\d+)"/);
    const ratingMatch = itemXml.match(/<rating value="([^"]+)"/);

    // Status flags
    const ownMatch = itemXml.match(/<status[^>]*own="(\d)"/);
    const wantToPlayMatch = itemXml.match(/<status[^>]*wanttoplay="(\d)"/);
    const wantToBuyMatch = itemXml.match(/<status[^>]*wanttobuy="(\d)"/);
    const wishlistMatch = itemXml.match(/<status[^>]*wishlist="(\d)"/);
    const preorderedMatch = itemXml.match(/<status[^>]*preordered="(\d)"/);

    if (nameMatch) {
      games.push({
        bggId,
        title: decodeHtmlEntities(nameMatch[1]),
        yearPublished: yearMatch ? parseInt(yearMatch[1], 10) : undefined,
        coverUrl: imageMatch ? imageMatch[1] : undefined,
        thumbnailUrl: thumbnailMatch ? thumbnailMatch[1] : undefined,
        minPlayers: minPlayersMatch ? parseInt(minPlayersMatch[1], 10) : undefined,
        maxPlayers: maxPlayersMatch ? parseInt(maxPlayersMatch[1], 10) : undefined,
        playtimeMin: minPlaytimeMatch ? parseInt(minPlaytimeMatch[1], 10) : undefined,
        playtimeMax: maxPlaytimeMatch ? parseInt(maxPlaytimeMatch[1], 10) : undefined,
        status: {
          own: ownMatch?.[1] === '1',
          wantToPlay: wantToPlayMatch?.[1] === '1',
          wantToBuy: wantToBuyMatch?.[1] === '1',
          wishlist: wishlistMatch?.[1] === '1',
          preordered: preorderedMatch?.[1] === '1',
        },
        numPlays: numPlaysMatch ? parseInt(numPlaysMatch[1], 10) : 0,
        rating: ratingMatch && ratingMatch[1] !== 'N/A' 
          ? parseFloat(ratingMatch[1]) 
          : undefined,
      });
    }
  }

  return games;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#10;/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
}

// Fetch full game details for a list of BGG IDs
export async function fetchBggGameDetails(
  bggIds: number[],
  session?: BggSession
): Promise<Map<number, Partial<BggCollectionGame>>> {
  const results = new Map<number, Partial<BggCollectionGame>>();
  
  // BGG allows batching up to ~20 IDs per request
  const batchSize = 20;
  
  for (let i = 0; i < bggIds.length; i += batchSize) {
    const batch = bggIds.slice(i, i + batchSize);
    const url = `${BGG_BASE}/xmlapi2/thing?id=${batch.join(',')}&stats=1`;
    
    const response = await fetch(url, {
      headers: session ? { Cookie: session.cookies } : {},
    });

    if (!response.ok) {
      console.warn(`Failed to fetch details for BGG IDs: ${batch.join(',')}`);
      continue;
    }

    const xml = await response.text();
    
    // Parse each item
    const itemRegex = /<item[^>]*id="(\d+)"[^>]*>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const bggId = parseInt(match[1], 10);
      const itemXml = match[2];

      const titleMatch = itemXml.match(/<name type="primary"[^>]*value="([^"]*)"/);
      const descMatch = itemXml.match(/<description>([^<]*)<\/description>/);
      const imageMatch = itemXml.match(/<image>([^<]*)<\/image>/);
      const minPlayersMatch = itemXml.match(/<minplayers value="(\d+)"/);
      const maxPlayersMatch = itemXml.match(/<maxplayers value="(\d+)"/);
      const minPlaytimeMatch = itemXml.match(/<minplaytime value="(\d+)"/);
      const maxPlaytimeMatch = itemXml.match(/<maxplaytime value="(\d+)"/);

      results.set(bggId, {
        bggId,
        title: titleMatch ? decodeHtmlEntities(titleMatch[1]) : undefined,
        coverUrl: imageMatch ? imageMatch[1] : undefined,
        minPlayers: minPlayersMatch ? parseInt(minPlayersMatch[1], 10) : undefined,
        maxPlayers: maxPlayersMatch ? parseInt(maxPlayersMatch[1], 10) : undefined,
        playtimeMin: minPlaytimeMatch ? parseInt(minPlaytimeMatch[1], 10) : undefined,
        playtimeMax: maxPlaytimeMatch ? parseInt(maxPlaytimeMatch[1], 10) : undefined,
      });
    }

    // Rate limit: wait between batches
    if (i + batchSize < bggIds.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

