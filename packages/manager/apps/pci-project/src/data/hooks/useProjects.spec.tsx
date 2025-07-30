/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  getDefaultProject,
  removeProject,
  unFavProject,
} from '@/data/api/projects';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';
import {
  useDefaultProjectQuery,
  useIsDefaultProject,
  useRemoveProjectMutation,
} from './useProjects';

// Mock the API functions
vi.mock('@/data/api/projects', () => ({
  getDefaultProject: vi.fn(),
  removeProject: vi.fn(),
  unFavProject: vi.fn(),
}));

describe('useProjects hooks', () => {
  const mockDefaultProject = { projectId: 'test-project-123' };

  describe('useRemoveProjectMutation', () => {
    it('should call removeProject when project is not default', async () => {
      const mockRemoveProject = vi.mocked(removeProject);
      const mockUnFavProject = vi.mocked(unFavProject);

      const onSuccess = vi.fn();
      const onError = vi.fn();
      const { result } = renderHook(
        () =>
          useRemoveProjectMutation({
            onSuccess,
            onError,
            isDefault: false,
          }),
        { wrapper: createOptimalWrapper({ queries: true }) },
      );

      const params = {
        projectId: 'test-project-123',
        serviceId: 'service-123',
        isUs: false,
      };

      await act(async () => {
        await result.current.mutateAsync(params);
      });

      expect(mockRemoveProject).toHaveBeenCalledWith(params);
      expect(mockUnFavProject).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it('should call both unFavProject and removeProject when project is default', async () => {
      const mockRemoveProject = vi.mocked(removeProject);
      const mockUnFavProject = vi.mocked(unFavProject);

      const onSuccess = vi.fn();
      const onError = vi.fn();
      const { result } = renderHook(
        () =>
          useRemoveProjectMutation({
            onSuccess,
            onError,
            isDefault: true,
          }),
        { wrapper: createOptimalWrapper({ queries: true }) },
      );

      const params = {
        projectId: 'test-project-123',
        serviceId: 'service-123',
        isUs: false,
      };

      await act(async () => {
        await result.current.mutateAsync(params);
      });

      expect(mockRemoveProject).toHaveBeenCalledWith(params);
      expect(mockUnFavProject).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('useDefaultProjectQuery', () => {
    it('should fetch default project data', async () => {
      vi.mocked(getDefaultProject).mockResolvedValueOnce(mockDefaultProject);

      const { result } = renderHook(() => useDefaultProjectQuery(), {
        wrapper: createOptimalWrapper({ queries: true }),
      });

      // Wait for the query to resolve
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockDefaultProject);
      expect(result.current.error).toBeNull();
    });
  });

  describe('useIsDefaultProject', () => {
    it('should return true when projectId matches default project', async () => {
      vi.mocked(getDefaultProject).mockResolvedValueOnce(mockDefaultProject);

      const { result } = renderHook(
        () => useIsDefaultProject('test-project-123'),
        {
          wrapper: createOptimalWrapper({ queries: true }),
        },
      );

      // Wait for the query to resolve
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return false when projectId does not match default project', async () => {
      vi.mocked(getDefaultProject).mockResolvedValueOnce(mockDefaultProject);

      const { result } = renderHook(
        () => useIsDefaultProject('different-project'),
        {
          wrapper: createOptimalWrapper({ queries: true }),
        },
      );

      // Wait for the query to resolve
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return false when no projectId is provided', async () => {
      vi.mocked(getDefaultProject).mockResolvedValueOnce(mockDefaultProject);

      const { result } = renderHook(() => useIsDefaultProject(), {
        wrapper: createOptimalWrapper({ queries: true }),
      });

      // Wait for the query to resolve
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
