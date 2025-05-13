import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as usersApi from '@/api//data/users';
import queryClient from '@/queryClient';
import { wrapper } from '@/wrapperRenders';
import {
  getUserCacheKey,
  getUsersCacheKey,
  invalidateGetUsersCache,
  useAllUsers,
  useDeleteUser,
  useGenerateS3Credentials,
  useUser,
} from './useUsers';

vi.mock('@/api/data/users');
vi.mock('@/queryClient', () => ({
  default: {
    invalidateQueries: vi.fn(),
  },
}));

vi.mock('@/helpers', () => ({
  isJson: vi.fn(),
  paginateResults: vi.fn(),
  sortResults: vi.fn(),
  applyFilters: vi.fn(),
}));

const mockProjectId = 'project-123';
const mockUserId = 456;
const mockAccess = 'access-key';
const mockUsers = [
  {
    id: 1,
    username: 'user1',
    description: 'desc1',
    creationDate: '2023-01-01',
  },
  {
    id: 2,
    username: 'user2',
    description: 'desc2',
    creationDate: '2023-01-02',
  },
  {
    id: 3,
    username: 'user3',
    description: 'desc3',
    creationDate: '2023-01-03',
  },
] as usersApi.TUser[];

const mockS3Credentials = [
  { userId: 100, access: 'access1' },
  { userId: 200, access: 'access2' },
];

describe('Users Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(usersApi.getAllUsers).mockResolvedValue(mockUsers);
    vi.mocked(usersApi.getUser).mockResolvedValue({
      id: 1,
      username: 'user1',
      description: 'desc1',
      creationDate: '2023-01-01',
    } as usersApi.TUser);
    vi.mocked(usersApi.getS3Credentials).mockImplementation(
      (_projectId, userId) => {
        if (userId === 1) return Promise.resolve([mockS3Credentials[0]]);
        if (userId === 2) return Promise.resolve([mockS3Credentials[1]]);
        return Promise.resolve([]);
      },
    );
  });

  describe('getUsersCacheKey', () => {
    it('should return the correct cache key for users', () => {
      expect(getUsersCacheKey(mockProjectId)).toEqual([
        'project',
        mockProjectId,
        'users',
      ]);
    });
  });

  describe('getUserCacheKey', () => {
    it('should return the correct query key for a specific user', () => {
      expect(getUserCacheKey(mockProjectId, mockUserId)).toEqual([
        mockUserId,
        mockProjectId,
        'user',
      ]);
    });
  });

  describe('invalidateGetUsersCache', () => {
    it('should call queryClient.invalidateQueries with the correct cache key', () => {
      invalidateGetUsersCache(mockProjectId);

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: getUsersCacheKey(mockProjectId),
      });
    });
  });

  describe('useAllUsers', () => {
    it('should fetch all users for a project', async () => {
      const { result } = renderHook(() => useAllUsers(mockProjectId), {
        wrapper,
      });

      await waitFor(() => expect(result.current.data).toEqual(mockUsers));

      expect(usersApi.getAllUsers).toHaveBeenCalledWith(mockProjectId);
    });
  });

  describe('useUser', () => {
    it('should return the user with the specified ID', async () => {
      const { result } = renderHook(() => useUser(mockProjectId, 1), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data).toBeDefined();
      expect(result.current.data.id).toBe(1);
    });
  });

  describe('useDeleteUser', () => {
    it('should call deleteUser API and invalidate cache on success', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      vi.mocked(usersApi.deleteUser).mockResolvedValue();

      const { result } = renderHook(
        () =>
          useDeleteUser({
            projectId: mockProjectId,
            userId: mockUserId,
            access: mockAccess,
            onSuccess,
            onError,
          }),
        { wrapper },
      );

      result.current.deleteUser();

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(usersApi.deleteUser).toHaveBeenCalledWith(
        mockProjectId,
        mockUserId,
        mockAccess,
      );
      expect(queryClient.invalidateQueries).toHaveBeenCalled();
    });
  });

  describe('useGenerateS3Credentials', () => {
    it('should call generateS3Credentials API, invalidate cache and trigger onSuccess', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const mockCredentials = {
        userId: `${mockUserId}`,
        access: 'new-access',
        secret: 'secret',
        tenantId: 'tenantId',
      };

      vi.mocked(usersApi.generateS3Credentials).mockResolvedValue(
        mockCredentials,
      );

      const { result } = renderHook(
        () =>
          useGenerateS3Credentials({
            projectId: mockProjectId,
            onSuccess,
            onError,
          }),
        { wrapper },
      );

      result.current.generateS3Credentials(mockUserId);

      await waitFor(() =>
        expect(onSuccess).toHaveBeenCalledWith(mockCredentials),
      );

      expect(usersApi.generateS3Credentials).toHaveBeenCalledWith(
        mockProjectId,
        mockUserId,
      );
    });
  });
});
