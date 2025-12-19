import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AccountAcl,
  addAccountAclToProject as apiAddAccountAclToProject,
  deleteAccountAclFromProject as apiDeleteAccountAclFromProject,
  getProjectAcl,
} from '@/data/api/acl';
import queryClient from '@/queryClient';
import { createWrapper } from '@/wrapperRenders';

import { useAddAccountAclToProject, useDeleteAccountAclFromProject, useProjectAcl } from './useAcl';

vi.mock('@/data/api/acl', () => ({
  getProjectAcl: vi.fn(),
  getProjectAclAccountInfo: vi.fn(),
  addAccountAclToProject: vi.fn(),
  deleteAccountAclFromProject: vi.fn(),
}));

vi.mock('@/queryClient', () => ({
  __esModule: true,
  default: {
    invalidateQueries: vi.fn(),
  },
}));

const mockGetProjectAcl = vi.mocked(getProjectAcl);
const mockApiAdd = vi.mocked(apiAddAccountAclToProject);
const mockApiDelete = vi.mocked(apiDeleteAccountAclFromProject);
const mockInvalidate = vi.mocked(queryClient.invalidateQueries);

describe('useAcl hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useProjectAcl', () => {
    it('fetches project ACL when projectId is provided', async () => {
      mockGetProjectAcl.mockResolvedValueOnce(['u1']);

      const { result } = renderHook(() => useProjectAcl('p-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toEqual(['u1']);
      expect(mockGetProjectAcl).toHaveBeenCalledWith('p-1');
    });
  });

  describe('useAddAccountAclToProject', () => {
    it('calls API, invalidates queries and triggers onSuccess', async () => {
      const account: AccountAcl = { accountId: 'u1', type: 'readOnly' };
      mockApiAdd.mockResolvedValueOnce(account);
      const onSuccess = vi.fn();
      const onError = vi.fn();

      const { result } = renderHook(
        () => useAddAccountAclToProject({ projectId: 'p-1', onSuccess, onError }),
        { wrapper: createWrapper() },
      );

      act(() => {
        result.current.addAccountAclToProject(account);
      });

      await waitFor(() => {
        expect(mockApiAdd).toHaveBeenCalledWith('p-1', account);
        expect(mockInvalidate).toHaveBeenCalledWith({
          queryKey: ['/project/p-1/acl'],
        });
        expect(mockInvalidate).toHaveBeenCalledWith({
          queryKey: ['/project/p-1/acl/u1'],
        });
        expect(onSuccess).toHaveBeenCalledWith(account);
      });

      expect(onError).not.toHaveBeenCalled();
    });

    it('triggers onError when API fails', async () => {
      const error = new Error('boom');
      mockApiAdd.mockRejectedValueOnce(error);
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const account: AccountAcl = { accountId: 'u2', type: 'readWrite' };

      const { result } = renderHook(
        () => useAddAccountAclToProject({ projectId: 'p-1', onSuccess, onError }),
        { wrapper: createWrapper() },
      );

      act(() => {
        result.current.addAccountAclToProject(account);
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  describe('useDeleteAccountAclFromProject', () => {
    it('calls API, invalidates queries and triggers onSuccess', async () => {
      mockApiDelete.mockResolvedValueOnce('u3');
      const onSuccess = vi.fn();
      const onError = vi.fn();

      const { result } = renderHook(
        () =>
          useDeleteAccountAclFromProject({
            projectId: 'p-1',
            onSuccess,
            onError,
          }),
        { wrapper: createWrapper() },
      );

      act(() => {
        result.current.deleteAccountAclFromProject('u3');
      });

      await waitFor(() => {
        expect(mockApiDelete).toHaveBeenCalledWith('p-1', 'u3');
        expect(mockInvalidate).toHaveBeenCalledWith({
          queryKey: ['/project/p-1/acl'],
        });
        expect(mockInvalidate).toHaveBeenCalledWith({
          queryKey: ['/project/p-1/acl/u3'],
        });
        expect(onSuccess).toHaveBeenCalledWith('u3');
      });

      expect(onError).not.toHaveBeenCalled();
    });

    it('triggers onError when API fails', async () => {
      const error = new Error('nope');
      mockApiDelete.mockRejectedValueOnce(error);
      const onSuccess = vi.fn();
      const onError = vi.fn();

      const { result } = renderHook(
        () =>
          useDeleteAccountAclFromProject({
            projectId: 'p-1',
            onSuccess,
            onError,
          }),
        { wrapper: createWrapper() },
      );

      act(() => {
        result.current.deleteAccountAclFromProject('u4');
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });
});
