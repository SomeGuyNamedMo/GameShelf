// ========== User Types ==========

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ========== Library Types ==========

export type LibraryRole = 'ADMIN' | 'MEMBER' | 'GUEST';

export interface Library {
  id: string;
  name: string;
  description: string | null;
  role: LibraryRole;
  gameCount: number;
  memberCount: number;
  createdAt: string;
}

export interface LibraryDetail extends Omit<Library, 'role' | 'gameCount' | 'memberCount'> {
  members: LibraryMember[];
}

export interface LibraryMember {
  userId: string;
  name: string;
  email: string;
  role: LibraryRole;
  joinedAt: string;
}

// ========== Game Types ==========

export type GameStatus = 'AVAILABLE' | 'BORROWED' | 'STORAGE';

export interface Game {
  id: string;
  bggId: number | null;
  title: string;
  coverUrl: string | null;
  minPlayers: number;
  maxPlayers: number;
  playtimeMin: number;
  playtimeMax: number;
  description: string | null;
  categories: string[];
  mechanics: string[];
  location: string | null;
  status: GameStatus;
  rating: number | null;
  timesPlayed: number;
  lastPlayedAt: string | null;
  expansionCount: number;
}

export interface GameExpansion {
  id: string;
  name: string;
  owned: boolean;
}

export interface BorrowRecord {
  id: string;
  borrower: {
    id: string;
    name: string;
  };
  borrowedAt: string;
  returnedAt: string | null;
}

export interface GameDetail extends Game {
  createdAt: string;
  expansions: GameExpansion[];
  borrowHistory: BorrowRecord[];
}

// ========== BGG Types ==========

export interface BGGSearchResult {
  bggId: number;
  title: string;
  yearPublished: number | null;
  thumbnailUrl: string | null;
}

export interface BGGGameDetail {
  bggId: number;
  title: string;
  description: string;
  yearPublished: number | null;
  coverUrl: string | null;
  minPlayers: number;
  maxPlayers: number;
  playtimeMin: number;
  playtimeMax: number;
  categories: string[];
  mechanics: string[];
  bggRating: number | null;
}

// ========== Borrow Types ==========

export interface ActiveBorrow {
  id: string;
  game: {
    id: string;
    title: string;
    coverUrl: string | null;
  };
  library: {
    id: string;
    name: string;
  };
  borrowedAt: string;
  dueAt: string | null;
}

export interface LibraryBorrow {
  id: string;
  game: {
    id: string;
    title: string;
  };
  borrower: {
    id: string;
    name: string;
    email: string;
  };
  borrowedAt: string;
  dueAt: string | null;
}

// ========== Playlist Types ==========

export interface SmartCriteria {
  maxPlaytime?: number;
  minPlayers?: number;
  maxPlayers?: number;
  status?: GameStatus;
  categories?: string[];
}

export interface Playlist {
  id: string;
  name: string;
  icon: string;
  isSmartList: boolean;
  smartCriteria?: SmartCriteria;
  gameCount: number;
}

export interface PlaylistDetail extends Omit<Playlist, 'gameCount'> {
  games: PlaylistGame[];
}

export interface PlaylistGame {
  id: string;
  title: string;
  coverUrl: string | null;
  order: number;
}

// ========== API Request Types ==========

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateLibraryRequest {
  name: string;
  description?: string;
}

export interface InviteMemberRequest {
  email: string;
  role: LibraryRole;
}

export interface UpdateMemberRoleRequest {
  role: LibraryRole;
}

export interface CreateGameRequest {
  bggId?: number;
  title: string;
  coverUrl?: string;
  minPlayers: number;
  maxPlayers: number;
  playtimeMin: number;
  playtimeMax: number;
  description?: string;
  categories?: string[];
  mechanics?: string[];
  location?: string;
}

export interface UpdateGameRequest {
  title?: string;
  location?: string;
  status?: GameStatus;
  rating?: number;
}

export interface CheckoutRequest {
  dueAt?: string;
}

export interface CreatePlaylistRequest {
  name: string;
  icon?: string;
  isSmartList?: boolean;
  smartCriteria?: SmartCriteria;
}

// ========== API Response Types ==========

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface GamesResponse {
  games: Game[];
  total: number;
}

export interface LibrariesResponse {
  libraries: Library[];
}

export interface PlaylistsResponse {
  playlists: Playlist[];
}

export interface BGGSearchResponse {
  results: BGGSearchResult[];
}

export interface ActiveBorrowsResponse {
  borrows: ActiveBorrow[];
}

export interface LibraryBorrowsResponse {
  borrows: LibraryBorrow[];
}

// ========== Query Filter Types ==========

export interface GameFilters {
  q?: string;
  status?: GameStatus;
  location?: string;
  minPlayers?: number;
  maxPlayers?: number;
  maxPlaytime?: number;
  category?: string;
  sort?: 'title' | 'rating' | 'lastPlayed' | 'playtime';
  order?: 'asc' | 'desc';
}

