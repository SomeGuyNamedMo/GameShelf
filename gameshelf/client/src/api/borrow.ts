import apiClient from './client';
import type {
  ActiveBorrow,
  ActiveBorrowsResponse,
  CheckoutRequest,
  LibraryBorrow,
  LibraryBorrowsResponse,
} from './types';

export const borrowApi = {
  /**
   * Checkout (borrow) a game
   */
  async checkoutGame(
    gameId: string,
    data?: CheckoutRequest
  ): Promise<{ id: string; gameId: string; gameTitle: string; borrowedAt: string; dueAt: string | null }> {
    const response = await apiClient.post(`/borrow/games/${gameId}/checkout`, data || {});
    return response.data;
  },

  /**
   * Return a borrowed game
   */
  async returnGame(
    gameId: string
  ): Promise<{ id: string; gameId: string; returnedAt: string }> {
    const response = await apiClient.post(`/borrow/games/${gameId}/return`);
    return response.data;
  },

  /**
   * Get current user's active borrows
   */
  async getActiveBorrows(): Promise<ActiveBorrow[]> {
    const response = await apiClient.get<ActiveBorrowsResponse>('/borrow/active');
    return response.data.borrows;
  },

  /**
   * Get all active borrows for a library
   */
  async getLibraryBorrows(libraryId: string): Promise<LibraryBorrow[]> {
    const response = await apiClient.get<LibraryBorrowsResponse>(
      `/libraries/${libraryId}/borrows`
    );
    return response.data.borrows;
  },
};

export default borrowApi;

