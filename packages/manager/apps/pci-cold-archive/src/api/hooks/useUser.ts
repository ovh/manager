import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getAllUsers,
  getS3Credentials,
  TS3Credentials,
  TUser,
} from '@/api/data/user';

export const getQueryKeyUsers = (projectId: string) => [
  'project',
  projectId,
  'users',
];

export const useAllUsers = (projectId: string) =>
  useQuery({
    queryKey: getQueryKeyUsers(projectId),
    queryFn: () => getAllUsers(projectId),
  });

export const useUsers = (
  projectId: string,
  filterWithCredentials?: boolean,
) => {
  const { data: users, isPending } = useAllUsers(projectId);
  const allUsersQueries = useQueries({
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

        if (filterWithCredentials && !s3Credentials) return all;

        all.push({
          ...user,
          access: s3Credentials?.access,
          s3Credentials,
          search: `${user.username} ${user.description} ${
            s3Credentials ? s3Credentials?.access : ''
          }`.trimEnd(),
        });

        return all;
      }, []),
    }),
  });

  const allUsers = allUsersQueries.data;
  const validUsers = allUsers?.filter((user) => user.status === 'ok');
  const validUsersWithCredentials = validUsers?.filter((user) => !!user.access);
  const validUsersWithoutCredentials = validUsers?.filter(
    (user) => !user.access,
  );

  return {
    ...allUsersQueries,
    validUsers,
    validUsersWithCredentials,
    validUsersWithoutCredentials,
  };
};
