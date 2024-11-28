import { ApiError, applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { paginateResults, sortResults } from '@/helpers';
import {
  deleteUser,
  getAllUsers,
  getS3Credentials,
  TS3Credentials,
  TUser,
  postS3Secret,
} from '@/api/data/user';

import queryClient from '@/queryClient';

const getQueryKeyUsers = (projectId: string) => ['project', projectId, 'users'];

export const useAllUsers = (projectId: string) =>
  useQuery({
    queryKey: getQueryKeyUsers(projectId),
    queryFn: () => getAllUsers(projectId),
  });

export const useUsers = (projectId: string) => {
  const { data: users, isPending } = useAllUsers(projectId);
  return useQueries({
    queries: (users || [])?.map((user) => ({
      queryKey: [...getQueryKeyUsers(projectId), user.id, 's3Credentials'],
      queryFn: () => getS3Credentials(projectId, `${user.id}`),
      enabled: !isPending,
      select: (s3Credentials: TS3Credentials[]) => s3Credentials[0],
    })),
    combine: (results) => ({
      isPending: results.some((result) => result.isPending),
      isLoading: results.some((result) => result.isLoading),
      error: results.find((result) => result.error),
      data: users?.reduce<TUser[]>((all, user) => {
        const s3Credentials = results.find(
          (result) => result.data?.userId === user.openstackId,
        )?.data;

        if (s3Credentials) {
          all.push({
            ...user,
            access: s3Credentials.access,
            search: `${user.username} ${user.description} ${s3Credentials.access}`,
          });
        }

        return all;
      }, []),
    }),
  });
};

export const usePaginatedUsers = (
  projectId: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const { data: users, error, isLoading, isPending } = useUsers(projectId);

  return useMemo(
    () => ({
      isLoading,
      isPending,
      paginatedUsers: paginateResults<TUser>(
        sortResults<TUser>(applyFilters<TUser>(users || [], filters), sorting),
        pagination,
      ),
      allUsers: users,
      error,
    }),
    [users, error, isLoading, isPending, pagination, sorting, filters],
  );
};

type DeleteUserProps = {
  projectId: string;
  userId: string;
  access: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteUser = ({
  projectId,
  userId,
  access,
  onError,
  onSuccess,
}: DeleteUserProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteUser(projectId, userId, access),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'users'],
      });
      onSuccess();
    },
  });
  return {
    deleteUser: () => mutation.mutate(),
  };
};

type UsePostS3SecretParams = {
  projectId: string;
  userId: number;
  userAccess: string;
  onSuccess: ({ secret }: { secret: string }) => void;
  onError: (cause: ApiError) => void;
};

export const usePostS3Secret = ({
  projectId,
  userId,
  userAccess,
  onSuccess,
  onError,
}: UsePostS3SecretParams) => {
  const mutation = useMutation({
    mutationFn: async () => postS3Secret(projectId, userId, userAccess),
    onError: (cause: ApiError) => {
      onError(cause);
    },
    onSuccess: async (response) => {
      onSuccess(response);
    },
  });

  return {
    postS3Secret: () => mutation.mutate(),
    ...mutation,
  };
};
