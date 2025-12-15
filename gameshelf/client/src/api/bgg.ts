import apiClient from './client';
import type { BGGGameDetail, BGGSearchResponse, BGGSearchResult } from './types';

export const bggApi = {
  /**
   * Search BoardGameGeek for games
   */
  async search(query: string): Promise<BGGSearchResult[]> {
    const response = await apiClient.get<BGGSearchResponse>('/bgg/search', {
      params: { q: query },
    });
    return response.data.results;
  },

  /**
   * Get full game details from BGG
   */
  async getGameDetails(bggId: number): Promise<BGGGameDetail> {
    const response = await apiClient.get<BGGGameDetail>(`/bgg/game/${bggId}`);
    return response.data;
  },
};

export default bggApi;

