import apiClient from './client';
import type {
  CreateGameRequest,
  Game,
  GameDetail,
  GameFilters,
  GamesResponse,
  UpdateGameRequest,
} from './types';

// Convert filters to query string
const buildQueryString = (filters?: GameFilters): string => {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export const gamesApi = {
  /**
   * Get games in a library with optional filters
   */
  async getGames(libraryId: string, filters?: GameFilters): Promise<GamesResponse> {
    const query = buildQueryString(filters);
    const response = await apiClient.get<GamesResponse>(
      `/libraries/${libraryId}/games${query}`
    );
    return response.data;
  },

  /**
   * Get single game details
   */
  async getGame(libraryId: string, gameId: string): Promise<GameDetail> {
    const response = await apiClient.get<GameDetail>(
      `/libraries/${libraryId}/games/${gameId}`
    );
    return response.data;
  },

  /**
   * Add a game to a library
   */
  async createGame(libraryId: string, data: CreateGameRequest): Promise<Game> {
    const response = await apiClient.post<Game>(
      `/libraries/${libraryId}/games`,
      data
    );
    return response.data;
  },

  /**
   * Update a game
   */
  async updateGame(
    libraryId: string,
    gameId: string,
    data: UpdateGameRequest
  ): Promise<Game> {
    const response = await apiClient.patch<Game>(
      `/libraries/${libraryId}/games/${gameId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a game (requires ADMIN)
   */
  async deleteGame(libraryId: string, gameId: string): Promise<void> {
    await apiClient.delete(`/libraries/${libraryId}/games/${gameId}`);
  },
};

export default gamesApi;

