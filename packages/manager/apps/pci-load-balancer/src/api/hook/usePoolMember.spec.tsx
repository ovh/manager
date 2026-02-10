import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { Filter, applyFilters } from '@ovh-ux/manager-core-api';

import {
  TPoolMember,
  createPoolMembers,
  deletePoolMember,
  getPoolMember,
  getPoolMembers,
  updatePoolMemberName,
} from '@/api/data/pool-member';
import { paginateResults, sortResults } from '@/helpers';
import { wrapper } from '@/wrapperRenders';

import {
  useCreatePoolMembers,
  useDeletePoolMember,
  useGetAllPoolMembers,
  useGetPoolMember,
  usePoolMembers,
  useUpdatePoolMember,
} from './usePoolMember';

vi.mock('@/api/data/pool-member', () => ({
  getPoolMembers: vi.fn(),
  getPoolMember: vi.fn(),
  deletePoolMember: vi.fn(),
  updatePoolMemberName: vi.fn(),
  createPoolMembers: vi.fn(),
}));

describe('usePoolMember hooks', () => {
  describe('useGetAllPoolMembers', () => {
    it('should fetch all pool members', async () => {
      const mockData = [
        { id: '1', name: 'member1', address: '127.0.0.1', protocolPort: 80 },
      ] as TPoolMember[];
      vi.mocked(getPoolMembers).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetAllPoolMembers('projectId', 'poolId', 'region'), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(
        mockData.map((member) => ({
          ...member,
          search: `${member.name} ${member.address} ${member.protocolPort}`,
        })),
      );
    });
  });

  describe('usePoolMembers', () => {
    it('should return paginated and sorted pool members', async () => {
      const mockData = [
        { id: '1', name: 'member1', address: '127.0.0.1', protocolPort: 80 },
      ] as TPoolMember[];
      vi.mocked(getPoolMembers).mockResolvedValue(mockData);
      vi.mocked(applyFilters).mockReturnValue(mockData);
      vi.mocked(sortResults).mockReturnValue(mockData);
      vi.mocked(paginateResults).mockReturnValue({
        rows: mockData,
        pageCount: 1,
        totalRows: 1,
      });

      const pagination = { pageIndex: 0, pageSize: 10 };
      const sorting = { id: 'name', desc: false };
      const filters: Filter[] = [];

      const { result } = renderHook(
        () => usePoolMembers('projectId', 'policyId', 'region', pagination, sorting, filters),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.paginatedPoolMembers).toEqual({
        rows: mockData,
        pageCount: 1,
        totalRows: 1,
      });
    });
  });

  describe('useDeletePoolMember', () => {
    it('should delete a pool member', async () => {
      vi.mocked(deletePoolMember).mockResolvedValue({});
      const onError = vi.fn();
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () =>
          useDeletePoolMember({
            projectId: 'projectId',
            poolId: 'poolId',
            memberId: 'memberId',
            region: 'region',
            onError,
            onSuccess,
          }),
        { wrapper },
      );

      act(() => {
        void result.current.deletePoolMember();
      });
      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(deletePoolMember).toHaveBeenCalledWith('projectId', 'region', 'poolId', 'memberId');
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('useGetPoolMember', () => {
    it('should fetch a single pool member', async () => {
      const mockData = {
        id: '1',
        name: 'member1',
        address: '127.0.0.1',
        protocolPort: 80,
      } as TPoolMember;
      vi.mocked(getPoolMember).mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useGetPoolMember('projectId', 'poolId', 'region', 'memberId'),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useUpdatePoolMember', () => {
    it('should update a pool member name', async () => {
      vi.mocked(updatePoolMemberName).mockResolvedValue({} as TPoolMember);
      const onError = vi.fn();
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () =>
          useUpdatePoolMember({
            projectId: 'projectId',
            poolId: 'poolId',
            memberId: 'memberId',
            region: 'region',
            name: 'newName',
            onError,
            onSuccess,
          }),
        { wrapper },
      );

      act(() => {
        void result.current.updatePoolMemberName();
      });
      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(updatePoolMemberName).toHaveBeenCalledWith(
        'projectId',
        'region',
        'poolId',
        'memberId',
        'newName',
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('useCreatePoolMembers', () => {
    it('should create pool members', async () => {
      vi.mocked(createPoolMembers).mockResolvedValue([] as TPoolMember[]);
      const onError = vi.fn();
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () =>
          useCreatePoolMembers({
            projectId: 'projectId',
            poolId: 'poolId',
            region: 'region',
            onError,
            onSuccess,
          }),
        { wrapper },
      );

      const newMembers = [
        { id: '2', name: 'member2', address: '127.0.0.2', protocolPort: 81 },
      ] as TPoolMember[];

      act(() => {
        void result.current.createPoolMembers(newMembers);
      });
      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(createPoolMembers).toHaveBeenCalledWith('projectId', 'region', 'poolId', newMembers);
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
