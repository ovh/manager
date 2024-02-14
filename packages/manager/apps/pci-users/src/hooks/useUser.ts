import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  filterUsers,
  getAllUsers,
  paginateResults,
  UsersOptions,
} from '@/data/user';

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
