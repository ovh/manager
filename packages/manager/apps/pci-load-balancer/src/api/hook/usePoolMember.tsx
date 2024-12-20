import { Filter, applyFilters } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  TPoolMember,
  createPoolMembers,
  deletePoolMember,
  getPoolMember,
  getPoolMembers,
  updatePoolMemberName,
} from '@/api/data/pool-member';
import { paginateResults, sortResults } from '@/helpers';
import queryClient from '@/queryClient';

export const useGetAllPoolMembers = (
  projectId: string,
  poolId: string,
  region: string,
) =>
  useQuery({
    queryKey: ['members', projectId, region, poolId],
    queryFn: () => getPoolMembers(projectId, region, poolId),
    select: (poolMembers: TPoolMember[]): TPoolMember[] =>
      poolMembers.map((member) => ({
        ...member,
        search: `${member.name} ${member.address} ${member.protocolPort}`,
      })),
  });

export const usePoolMembers = (
  projectId: string,
  policyId: string,
  region: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const {
    data: allPoolMembers,
    error,
    isLoading,
    isPending,
  } = useGetAllPoolMembers(projectId, policyId, region);
  return useMemo(
    () => ({
      isLoading,
      isPending,
      allPoolMembers,
      paginatedPoolMembers: paginateResults<TPoolMember>(
        sortResults<TPoolMember>(
          applyFilters(allPoolMembers || [], filters),
          sorting,
        ),
        pagination,
      ),
      error,
    }),
    [allPoolMembers, error, isLoading, isPending, pagination, sorting, filters],
  );
};

type DeletePoolMemberProps = {
  projectId: string;
  poolId: string;
  memberId: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeletePoolMember = ({
  projectId,
  poolId,
  memberId,
  region,
  onError,
  onSuccess,
}: DeletePoolMemberProps) => {
  const mutation = useMutation({
    mutationFn: async () =>
      deletePoolMember(projectId, region, poolId, memberId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['members', projectId, region, poolId],
      });
      onSuccess();
    },
  });
  return {
    deletePoolMember: () => mutation.mutate(),
    ...mutation,
  };
};

export const useGetPoolMember = (
  projectId: string,
  poolId: string,
  region: string,
  memberId: string,
) =>
  useQuery({
    queryKey: ['member', projectId, region, poolId, memberId],
    queryFn: () => getPoolMember(projectId, region, poolId, memberId),
  });

type UpdatePoolMemberProps = {
  projectId: string;
  poolId: string;
  memberId: string;
  region: string;
  name: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useUpdatePoolMember = ({
  projectId,
  poolId,
  memberId,
  region,
  name,
  onError,
  onSuccess,
}: UpdatePoolMemberProps) => {
  const mutation = useMutation({
    mutationFn: async () =>
      updatePoolMemberName(projectId, region, poolId, memberId, name),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['members', projectId, region, poolId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['member', projectId, region, poolId, memberId],
      });
      onSuccess();
    },
  });
  return {
    updatePoolMemberName: () => mutation.mutate(),
    ...mutation,
  };
};

type CreatePoolMembersProps = {
  projectId: string;
  poolId: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useCreatePoolMembers = ({
  projectId,
  poolId,
  region,
  onError,
  onSuccess,
}: CreatePoolMembersProps) => {
  const mutation = useMutation({
    mutationFn: async (members: Partial<TPoolMember[]>) =>
      createPoolMembers(projectId, region, poolId, members),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['members', projectId, region, poolId],
      });
      onSuccess();
    },
  });
  return {
    createPoolMembers: (members: Partial<TPoolMember[]>) =>
      mutation.mutate(members),
    ...mutation,
  };
};
