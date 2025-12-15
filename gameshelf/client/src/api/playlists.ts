import apiClient from './client';
import type {
  CreatePlaylistRequest,
  Playlist,
  PlaylistDetail,
  PlaylistsResponse,
} from './types';

export const playlistsApi = {
  /**
   * Get all playlists for a library
   */
  async getPlaylists(libraryId: string): Promise<Playlist[]> {
    const response = await apiClient.get<PlaylistsResponse>(
      `/libraries/${libraryId}/playlists`
    );
    return response.data.playlists;
  },

  /**
   * Create a new playlist
   */
  async createPlaylist(libraryId: string, data: CreatePlaylistRequest): Promise<Playlist> {
    const response = await apiClient.post<Playlist>(
      `/libraries/${libraryId}/playlists`,
      data
    );
    return response.data;
  },

  /**
   * Get playlist with games
   */
  async getPlaylist(playlistId: string): Promise<PlaylistDetail> {
    const response = await apiClient.get<PlaylistDetail>(`/playlists/${playlistId}`);
    return response.data;
  },

  /**
   * Add game to playlist
   */
  async addGameToPlaylist(playlistId: string, gameId: string): Promise<void> {
    await apiClient.post(`/playlists/${playlistId}/games`, { gameId });
  },

  /**
   * Remove game from playlist
   */
  async removeGameFromPlaylist(playlistId: string, gameId: string): Promise<void> {
    await apiClient.delete(`/playlists/${playlistId}/games/${gameId}`);
  },
};

export default playlistsApi;

