// Mock data for development without backend
import type {
  ActiveBorrow,
  BGGSearchResult,
  Game,
  GameDetail,
  Library,
  LibraryDetail,
  Playlist,
  PlaylistDetail,
  User,
} from './types';

// ========== Mock User ==========

export const mockUser: User = {
  id: 'user_001',
  email: 'demo@gameshelf.app',
  name: 'Alex Chen',
  avatarUrl: null,
  createdAt: '2024-01-15T10:00:00Z',
};

// ========== Mock Libraries ==========

export const mockLibraries: Library[] = [
  {
    id: 'lib_001',
    name: 'Home Collection',
    description: 'Our family board game collection',
    role: 'ADMIN',
    gameCount: 47,
    memberCount: 4,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'lib_002',
    name: 'Game Night Club',
    description: 'Shared collection for our weekly game night group',
    role: 'MEMBER',
    gameCount: 23,
    memberCount: 8,
    createdAt: '2024-02-20T10:00:00Z',
  },
];

export const mockLibraryDetail: LibraryDetail = {
  id: 'lib_001',
  name: 'Home Collection',
  description: 'Our family board game collection',
  createdAt: '2024-01-15T10:00:00Z',
  members: [
    {
      userId: 'user_001',
      name: 'Alex Chen',
      email: 'demo@gameshelf.app',
      role: 'ADMIN',
      joinedAt: '2024-01-15T10:00:00Z',
    },
    {
      userId: 'user_002',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      role: 'MEMBER',
      joinedAt: '2024-01-16T10:00:00Z',
    },
    {
      userId: 'user_003',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'MEMBER',
      joinedAt: '2024-01-20T10:00:00Z',
    },
  ],
};

// ========== Mock Games ==========

export const mockGames: Game[] = [
  {
    id: 'game_001',
    bggId: 266192,
    title: 'Wingspan',
    coverUrl: 'https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__original/img/uIjeoKgHMcRtzRSR4MoUYl3nXxs=/0x0/filters:format(png)/pic4458123.png',
    minPlayers: 1,
    maxPlayers: 5,
    playtimeMin: 40,
    playtimeMax: 70,
    description: 'A competitive bird-collection, engine-building game where players seek to discover and attract the best birds to their wildlife preserves.',
    categories: ['Card Game', 'Animals', 'Economic'],
    mechanics: ['Engine Building', 'Hand Management', 'Set Collection'],
    location: 'Main Shelf A',
    status: 'AVAILABLE',
    rating: 4.5,
    timesPlayed: 12,
    lastPlayedAt: '2024-01-10T18:00:00Z',
    expansionCount: 3,
  },
  {
    id: 'game_002',
    bggId: 174430,
    title: 'Gloomhaven',
    coverUrl: 'https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__original/img/7d-lj5Gd1e8PFnD97LYFah2c45M=/0x0/filters:format(jpeg)/pic2437871.jpg',
    minPlayers: 1,
    maxPlayers: 4,
    playtimeMin: 60,
    playtimeMax: 150,
    description: 'A game of Euro-inspired tactical combat in a persistent world of shifting motives.',
    categories: ['Adventure', 'Exploration', 'Fantasy'],
    mechanics: ['Campaign', 'Cooperative', 'Hand Management', 'Modular Board'],
    location: 'Bottom Shelf',
    status: 'AVAILABLE',
    rating: 5,
    timesPlayed: 24,
    lastPlayedAt: '2024-01-12T19:00:00Z',
    expansionCount: 2,
  },
  {
    id: 'game_003',
    bggId: 167791,
    title: 'Terraforming Mars',
    coverUrl: 'https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__original/img/thIqWDnH9utKuoNVEUg3Fe-zujs=/0x0/filters:format(jpeg)/pic3536616.jpg',
    minPlayers: 1,
    maxPlayers: 5,
    playtimeMin: 90,
    playtimeMax: 120,
    description: 'Compete with rival CEOs to make Mars habitable and build your corporate empire.',
    categories: ['Economic', 'Science Fiction', 'Territory Building'],
    mechanics: ['Card Drafting', 'Hand Management', 'Tile Placement', 'Variable Player Powers'],
    location: 'Main Shelf B',
    status: 'BORROWED',
    rating: 4,
    timesPlayed: 8,
    lastPlayedAt: '2024-01-05T20:00:00Z',
    expansionCount: 5,
  },
  {
    id: 'game_004',
    bggId: 224517,
    title: 'Brass: Birmingham',
    coverUrl: 'https://cf.geekdo-images.com/x3zxjr-Vw5iU4yDPg70Jgw__original/img/FpyxH41Y6_ROoePAilPNEhXnzO8=/0x0/filters:format(jpeg)/pic3490053.jpg',
    minPlayers: 2,
    maxPlayers: 4,
    playtimeMin: 60,
    playtimeMax: 120,
    description: 'Build networks, grow industries, and navigate the world of canals and rails in Birmingham.',
    categories: ['Economic', 'Industry', 'Transportation'],
    mechanics: ['Hand Management', 'Network Building', 'Route Building'],
    location: 'Main Shelf A',
    status: 'AVAILABLE',
    rating: 5,
    timesPlayed: 6,
    lastPlayedAt: '2024-01-08T19:00:00Z',
    expansionCount: 0,
  },
  {
    id: 'game_005',
    bggId: 233078,
    title: 'Twilight Imperium: 4th Edition',
    coverUrl: 'https://cf.geekdo-images.com/op8PyNMp8HEfKGBL3OdBnQ__original/img/rkg8rSV9rFO0x6vJA7XYfTPJ82s=/0x0/filters:format(jpeg)/pic3727516.jpg',
    minPlayers: 3,
    maxPlayers: 6,
    playtimeMin: 240,
    playtimeMax: 480,
    description: 'Build an intergalactic empire through trade, warfare, and political maneuvering.',
    categories: ['Civilization', 'Negotiation', 'Science Fiction', 'Space Exploration'],
    mechanics: ['Area Control', 'Dice Rolling', 'Trading', 'Variable Player Powers'],
    location: 'Storage',
    status: 'STORAGE',
    rating: 4.5,
    timesPlayed: 2,
    lastPlayedAt: '2023-12-15T12:00:00Z',
    expansionCount: 1,
  },
  {
    id: 'game_006',
    bggId: 220308,
    title: 'Gaia Project',
    coverUrl: 'https://cf.geekdo-images.com/hGWFm3hbMlCDsfCsauOQ4g__original/img/tjlflQtUPFiTpLpwk1NCVCS-eYw=/0x0/filters:format(jpeg)/pic5375625.jpg',
    minPlayers: 1,
    maxPlayers: 4,
    playtimeMin: 60,
    playtimeMax: 150,
    description: 'Expand, research, upgrade, and settle the galaxy with one of 14 unique alien factions.',
    categories: ['Civilization', 'Economic', 'Science Fiction'],
    mechanics: ['Area Control', 'Network Building', 'Variable Player Powers'],
    location: 'Main Shelf B',
    status: 'AVAILABLE',
    rating: 4.5,
    timesPlayed: 5,
    lastPlayedAt: '2024-01-06T18:00:00Z',
    expansionCount: 0,
  },
  {
    id: 'game_007',
    bggId: 237182,
    title: 'Root',
    coverUrl: 'https://cf.geekdo-images.com/JUAUWaVUzeBgzirhZNmHHw__original/img/zS2H_B2_AkfwSBL-Nlr_XHPUDFU=/0x0/filters:format(png)/pic4254509.png',
    minPlayers: 2,
    maxPlayers: 4,
    playtimeMin: 60,
    playtimeMax: 90,
    description: 'Fight for control of the woodlands in an asymmetric game of adventure and war.',
    categories: ['Animals', 'Fantasy', 'Wargame'],
    mechanics: ['Action Points', 'Area Control', 'Variable Player Powers'],
    location: 'Main Shelf A',
    status: 'AVAILABLE',
    rating: 4,
    timesPlayed: 10,
    lastPlayedAt: '2024-01-09T17:00:00Z',
    expansionCount: 4,
  },
  {
    id: 'game_008',
    bggId: 161936,
    title: 'Pandemic Legacy: Season 1',
    coverUrl: 'https://cf.geekdo-images.com/254NmnCYKj7_pUrmUNmUjQ__original/img/B8hkK8H_uyVgNSLGhOFPPXE51SA=/0x0/filters:format(jpeg)/pic2452831.jpg',
    minPlayers: 2,
    maxPlayers: 4,
    playtimeMin: 60,
    playtimeMax: 60,
    description: 'A cooperative legacy game where players work to cure diseases across 12 months of gameplay.',
    categories: ['Medical', 'Science Fiction'],
    mechanics: ['Cooperative', 'Hand Management', 'Legacy', 'Point to Point Movement'],
    location: 'Main Shelf B',
    status: 'AVAILABLE',
    rating: 5,
    timesPlayed: 15,
    lastPlayedAt: '2024-01-03T19:00:00Z',
    expansionCount: 0,
  },
  {
    id: 'game_009',
    bggId: 182028,
    title: 'Through the Ages',
    coverUrl: 'https://cf.geekdo-images.com/fVwPntkJKgaEo0rIC0RwpA__original/img/1Hf0S6VvZpZt_M6rbcL5FJjNk8M=/0x0/filters:format(jpeg)/pic2663291.jpg',
    minPlayers: 2,
    maxPlayers: 4,
    playtimeMin: 120,
    playtimeMax: 240,
    description: 'Guide your civilization from antiquity to the modern day in this card drafting game.',
    categories: ['Card Game', 'Civilization', 'Economic'],
    mechanics: ['Action Points', 'Auction', 'Card Drafting', 'Hand Management'],
    location: 'Main Shelf A',
    status: 'AVAILABLE',
    rating: 4.5,
    timesPlayed: 4,
    lastPlayedAt: '2024-01-01T14:00:00Z',
    expansionCount: 0,
  },
  {
    id: 'game_010',
    bggId: 205637,
    title: 'Arkham Horror: The Card Game',
    coverUrl: 'https://cf.geekdo-images.com/4ZzcCpAPnVJVduUO0kJbRA__original/img/M_zMFnlhJXEEqPCaK6dCg4GUHNQ=/0x0/filters:format(jpeg)/pic3122349.jpg',
    minPlayers: 1,
    maxPlayers: 2,
    playtimeMin: 60,
    playtimeMax: 120,
    description: 'Investigate eldritch horrors in this cooperative living card game set in the Lovecraft universe.',
    categories: ['Card Game', 'Horror', 'Novel-based'],
    mechanics: ['Cooperative', 'Deck Building', 'Hand Management', 'Variable Player Powers'],
    location: 'Main Shelf B',
    status: 'AVAILABLE',
    rating: 4,
    timesPlayed: 20,
    lastPlayedAt: '2024-01-11T20:00:00Z',
    expansionCount: 8,
  },
  {
    id: 'game_011',
    bggId: 169786,
    title: 'Scythe',
    coverUrl: 'https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BUZdA__original/img/HlDb9F365w0tSP3PW7lSIwkyDNU=/0x0/filters:format(jpeg)/pic3163924.jpg',
    minPlayers: 1,
    maxPlayers: 5,
    playtimeMin: 90,
    playtimeMax: 115,
    description: 'An alternate-history engine-building game set in 1920s Europe with mechs and resources.',
    categories: ['Economic', 'Science Fiction', 'Territory Building'],
    mechanics: ['Area Control', 'Engine Building', 'Grid Movement', 'Variable Player Powers'],
    location: 'Main Shelf A',
    status: 'AVAILABLE',
    rating: 4.5,
    timesPlayed: 7,
    lastPlayedAt: '2024-01-07T18:00:00Z',
    expansionCount: 3,
  },
  {
    id: 'game_012',
    bggId: 31260,
    title: 'Agricola',
    coverUrl: 'https://cf.geekdo-images.com/dDDo2Hexl80ucK1IlqTk-g__original/img/TFGqpYzy2hcyO_l8VAaKpbL25Bk=/0x0/filters:format(jpeg)/pic831744.jpg',
    minPlayers: 1,
    maxPlayers: 5,
    playtimeMin: 30,
    playtimeMax: 150,
    description: 'Become a medieval farmer raising livestock and crops to feed your family.',
    categories: ['Animals', 'Economic', 'Farming'],
    mechanics: ['Card Drafting', 'Hand Management', 'Variable Player Powers', 'Worker Placement'],
    location: 'Main Shelf B',
    status: 'AVAILABLE',
    rating: 4,
    timesPlayed: 9,
    lastPlayedAt: '2024-01-04T19:00:00Z',
    expansionCount: 2,
  },
];

// ========== Mock Game Detail ==========

export const mockGameDetail: GameDetail = {
  ...mockGames[0],
  createdAt: '2024-01-01T10:00:00Z',
  expansions: [
    { id: 'exp_001', name: 'European Expansion', owned: true },
    { id: 'exp_002', name: 'Oceania Expansion', owned: true },
    { id: 'exp_003', name: 'Asia Expansion', owned: false },
  ],
  borrowHistory: [
    {
      id: 'borrow_001',
      borrower: { id: 'user_003', name: 'Mike Johnson' },
      borrowedAt: '2024-01-05T10:00:00Z',
      returnedAt: '2024-01-08T10:00:00Z',
    },
  ],
};

// ========== Mock Playlists ==========

export const mockPlaylists: Playlist[] = [
  {
    id: 'pl_001',
    name: 'Date Night',
    icon: '❤️',
    isSmartList: false,
    gameCount: 5,
  },
  {
    id: 'pl_002',
    name: 'Quick Plays',
    icon: '⚡',
    isSmartList: true,
    smartCriteria: { maxPlaytime: 30, status: 'AVAILABLE' },
    gameCount: 8,
  },
  {
    id: 'pl_003',
    name: 'Party Games',
    icon: '🎉',
    isSmartList: true,
    smartCriteria: { minPlayers: 5, status: 'AVAILABLE' },
    gameCount: 6,
  },
  {
    id: 'pl_004',
    name: 'Solo Adventures',
    icon: '🧘',
    isSmartList: true,
    smartCriteria: { maxPlayers: 1, status: 'AVAILABLE' },
    gameCount: 4,
  },
  {
    id: 'pl_005',
    name: 'Weekend Epics',
    icon: '🏔️',
    isSmartList: false,
    gameCount: 3,
  },
];

export const mockPlaylistDetail: PlaylistDetail = {
  id: 'pl_001',
  name: 'Date Night',
  icon: '❤️',
  isSmartList: false,
  games: [
    { id: 'game_001', title: 'Wingspan', coverUrl: mockGames[0].coverUrl, order: 0 },
    { id: 'game_004', title: 'Brass: Birmingham', coverUrl: mockGames[3].coverUrl, order: 1 },
  ],
};

// ========== Mock Active Borrows ==========

export const mockActiveBorrows: ActiveBorrow[] = [
  {
    id: 'borrow_002',
    game: {
      id: 'game_003',
      title: 'Terraforming Mars',
      coverUrl: mockGames[2].coverUrl,
    },
    library: {
      id: 'lib_001',
      name: 'Home Collection',
    },
    borrowedAt: '2024-01-12T10:00:00Z',
    dueAt: '2024-01-26T10:00:00Z',
  },
];

// ========== Mock BGG Search Results ==========

export const mockBGGSearchResults: BGGSearchResult[] = [
  {
    bggId: 266192,
    title: 'Wingspan',
    yearPublished: 2019,
    thumbnailUrl: 'https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__thumb/img/wYHSQhEY7jNbz5qHvozRfn7cKPU=/fit-in/200x150/filters:strip_icc()/pic4458123.png',
  },
  {
    bggId: 290448,
    title: 'Wingspan: European Expansion',
    yearPublished: 2019,
    thumbnailUrl: 'https://cf.geekdo-images.com/dtVS8cxhDynpQ3pGPMhXGg__thumb/img/E2YZs2eJkbnkc4lGCfFEEG2k3CE=/fit-in/200x150/filters:strip_icc()/pic4989498.png',
  },
  {
    bggId: 300580,
    title: 'Wingspan: Oceania Expansion',
    yearPublished: 2020,
    thumbnailUrl: 'https://cf.geekdo-images.com/5hWSwfVH_uPGi4YR8e0c4Q__thumb/img/L4y9hfAqmkMvqSBgTILXfNZ_u7g=/fit-in/200x150/filters:strip_icc()/pic5666597.jpg',
  },
];

// ========== Mock Delay Utility ==========

export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// ========== Mock API Functions ==========

export const mockApi = {
  // Auth
  async login(email: string, _password: string) {
    await delay(500);
    // In mock mode, accept any non-empty email
    if (email && email.includes('@')) {
      return { 
        user: { ...mockUser, email }, 
        token: 'mock_jwt_token_12345' 
      };
    }
    throw new Error('Invalid credentials');
  },

  async register(_email: string, _password: string, name: string) {
    await delay(500);
    return {
      user: { ...mockUser, name },
      token: 'mock_jwt_token_12345',
    };
  },

  async getCurrentUser() {
    await delay(300);
    return mockUser;
  },

  // Libraries
  async getLibraries() {
    await delay(400);
    return mockLibraries;
  },

  async getLibrary(_libraryId: string) {
    await delay(300);
    return mockLibraryDetail;
  },

  // Games
  async getGames(_libraryId: string, filters?: { q?: string; status?: string }) {
    await delay(400);
    let filteredGames = [...mockGames];
    
    if (filters?.status) {
      filteredGames = filteredGames.filter(g => g.status === filters.status);
    }
    
    if (filters?.q) {
      const query = filters.q.toLowerCase();
      filteredGames = filteredGames.filter(g =>
        g.title.toLowerCase().includes(query) ||
        g.categories.some(c => c.toLowerCase().includes(query))
      );
    }
    
    return { games: filteredGames, total: filteredGames.length };
  },

  async getGame(_libraryId: string, gameId: string) {
    await delay(300);
    const game = mockGames.find(g => g.id === gameId);
    if (!game) throw new Error('Game not found');
    return {
      ...game,
      createdAt: '2024-01-01T10:00:00Z',
      expansions: mockGameDetail.expansions,
      borrowHistory: mockGameDetail.borrowHistory,
    } as GameDetail;
  },

  // Playlists
  async getPlaylists(_libraryId: string) {
    await delay(300);
    return mockPlaylists;
  },

  async getPlaylist(playlistId: string) {
    await delay(300);
    const playlist = mockPlaylists.find(p => p.id === playlistId);
    if (!playlist) throw new Error('Playlist not found');
    return {
      ...playlist,
      games: mockPlaylistDetail.games,
    } as PlaylistDetail;
  },

  // Borrows
  async getActiveBorrows() {
    await delay(300);
    return mockActiveBorrows;
  },

  // BGG
  async searchBGG(query: string) {
    await delay(600);
    return mockBGGSearchResults.filter(r =>
      r.title.toLowerCase().includes(query.toLowerCase())
    );
  },
};

export default mockApi;

