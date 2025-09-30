import { QueryObserverOptions, useQueries } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import user from '@/types/User';
import { getUserS3Credentials } from '@/data/api/user/user.api';

export interface UserWithS3Credentials extends user.User {
  access_key: string;
}

export const useGetUsersWithS3Credentials = (
  projectId: string,
  users: user.User[],
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) => {
  const s3CredentialsQueries = useQueries({
    queries: users
      ? users.map((us) => {
          return {
            queryKey: [projectId, 'user', us.id, 's3Credentials'],
            queryFn: () =>
              getUserS3Credentials({
                projectId,
                userId: us.id,
              }),
            ...options,
            select: (s3CredArray: user.S3Credentials[]) => {
              const access = s3CredArray[0]?.access;
              return { ...us, access_key: access || '' };
            },
          };
        })
      : [],
  });

  const refetchAll = useCallback(() => {
    s3CredentialsQueries.forEach((us) => us.refetch());
  }, [s3CredentialsQueries]);

  const userWithS3: UserWithS3Credentials[] = s3CredentialsQueries.flatMap(
    (userS3) => {
      return userS3.data || [];
    },
  );

  // refetch if pooling changes
  const prevRefetchInterval = useRef(options?.refetchInterval);
  useEffect(() => {
    if (
      options?.enabled !== false &&
      options.refetchInterval !== undefined &&
      options.refetchInterval !== prevRefetchInterval.current
    ) {
      refetchAll();
    }
    prevRefetchInterval.current = options.refetchInterval;
  }, [options.refetchInterval, options.enabled, refetchAll]);

  return {
    data: userWithS3,
    refetchAll,
  };
};
