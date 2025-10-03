/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { createWrapper } from '@/wrapperRenders';
import {
  getProjectAcl,
  getProjectAclAccountInfo,
  addAccountAclToProject as apiAddAccountAclToProject,
  deleteAccountAclFromProject as apiDeleteAccountAclFromProject,
  AccountAcl,
} from '@/data/api/acl';
import queryClient from '@/queryClient';
import {
  useProjectAcl,
  useProjectAclAccountsInfo,
  useAddAccountAclToProject,
  useDeleteAccountAclFromProject,
} from './useAcl';

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
const mockGetProjectAclAccountInfo = vi.mocked(getProjectAclAccountInfo);
const mockApiAdd = vi.mocked(apiAddAccountAclToProject);
const mockApiDelete = vi.mocked(apiDeleteAccountAclFromProject);
const mockInvalidate = vi.mocked(queryClient.invalidateQueries);

describe('useAcl hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useProjectAcl', () => {
    it('fetches project ACL when projectId is provided', async () => {
      mockGetProjectAcl.mockResolvedValueOnce([
        { accountId: 'u1', type: 'readOnly' },
      ] as any);

      const { result } = renderHook(() => useProjectAcl('p-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toEqual([
        { accountId: 'u1', type: 'readOnly' },
      ]);
      expect(mockGetProjectAcl).toHaveBeenCalledWith('p-1');
    });
  });

  describe('useProjectAclAccountsInfo', () => {
    it('fetches account infos for provided account ids and combines data', async () => {
      mockGetProjectAclAccountInfo
        .mockResolvedValueOnce({ accountId: 'u1', type: 'readOnly' } as any)
        .mockResolvedValueOnce(null as any);

      const { result } = renderHook(
        () => useProjectAclAccountsInfo('p-1', ['u1', 'u2']),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(Array.isArray(result.current)).toBe(true);
        expect(result.current.length).toBe(1);
      });

      expect(result.current).toEqual([{ accountId: 'u1', type: 'readOnly' }]);
      expect(mockGetProjectAclAccountInfo).toHaveBeenCalledWith('p-1', 'u1');
      expect(mockGetProjectAclAccountInfo).toHaveBeenCalledWith('p-1', 'u2');
    });
  });

  describe('useAddAccountAclToProject', () => {
    it('calls API, invalidates queries and triggers onSuccess', async () => {
      const account: AccountAcl = { accountId: 'u1', type: 'readOnly' } as any;
      mockApiAdd.mockResolvedValueOnce(account as any);
      const onSuccess = vi.fn();
      const onError = vi.fn();

      const { result } = renderHook(
        () =>
          useAddAccountAclToProject({ projectId: 'p-1', onSuccess, onError }),
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
      const error = new Error('boom') as any;
      mockApiAdd.mockRejectedValueOnce(error);
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const account: AccountAcl = { accountId: 'u2', type: 'readWrite' } as any;

      const { result } = renderHook(
        () =>
          useAddAccountAclToProject({ projectId: 'p-1', onSuccess, onError }),
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
      mockApiDelete.mockResolvedValueOnce('u3' as any);
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
      const error = new Error('nope') as any;
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
