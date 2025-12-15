import apiClient from './client';
import type {
  CreateLibraryRequest,
  InviteMemberRequest,
  LibrariesResponse,
  Library,
  LibraryDetail,
  LibraryMember,
  UpdateMemberRoleRequest,
} from './types';

export const librariesApi = {
  /**
   * Get all libraries the user belongs to
   */
  async getLibraries(): Promise<Library[]> {
    const response = await apiClient.get<LibrariesResponse>('/libraries');
    return response.data.libraries;
  },

  /**
   * Create a new library
   */
  async createLibrary(data: CreateLibraryRequest): Promise<Library> {
    const response = await apiClient.post<Library>('/libraries', data);
    return response.data;
  },

  /**
   * Get library details with members
   */
  async getLibrary(libraryId: string): Promise<LibraryDetail> {
    const response = await apiClient.get<LibraryDetail>(`/libraries/${libraryId}`);
    return response.data;
  },

  /**
   * Invite a member to library (requires ADMIN)
   */
  async inviteMember(libraryId: string, data: InviteMemberRequest): Promise<LibraryMember> {
    const response = await apiClient.post<LibraryMember>(
      `/libraries/${libraryId}/members`,
      data
    );
    return response.data;
  },

  /**
   * Update member role (requires ADMIN)
   */
  async updateMemberRole(
    libraryId: string,
    userId: string,
    data: UpdateMemberRoleRequest
  ): Promise<{ userId: string; role: string }> {
    const response = await apiClient.patch<{ userId: string; role: string }>(
      `/libraries/${libraryId}/members/${userId}`,
      data
    );
    return response.data;
  },

  /**
   * Remove member from library (requires ADMIN)
   */
  async removeMember(libraryId: string, userId: string): Promise<void> {
    await apiClient.delete(`/libraries/${libraryId}/members/${userId}`);
  },
};

export default librariesApi;

