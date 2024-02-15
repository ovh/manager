import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  filterUsers,
  getAllUsers,
  getUser,
  paginateResults,
  removeUser,
  UsersOptions,
} from '@/data/user';

type RemoveUserProps = {
  projectId: string;
  userId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useAllUsers = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'users'],
    queryFn: () => getAllUsers(projectId),
    retry: false,
  });
};

export const useUsers = (
  projectId: string,
  { pagination, sorting }: UsersOptions,
  searchQueries: string[],
) => {
  // retrieve All users from API
  const { data: users, error, isLoading } = useAllUsers(projectId);

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: paginateResults(
        filterUsers(users || [], sorting, searchQueries),
        pagination,
      ),
    };
  }, [users, sorting, searchQueries]);
};

export const useUser = (projectId: string, userId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'user', userId],
    queryFn: () => getUser(projectId, userId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export function useRemoveUser({
  projectId,
  userId,
  onError,
  onSuccess,
}: RemoveUserProps) {
  const mutation = useMutation({
    mutationFn: () => {
      return removeUser(projectId, userId);
    },
    onError,
    onSuccess,
  });

  return {
    remove: () => {
      return mutation.mutate();
    },
    ...mutation,
  };
}
