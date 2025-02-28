import { ApiError, applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { isJson, paginateResults, sortResults } from '@/helpers';

import queryClient from '@/queryClient';
import {
  deleteUser,
  generateS3Credentials,
  getAllUsers,
  getS3Credentials,
  importUserPolicy,
  postS3Secret,
  TS3Credentials,
  TUser,
} from '../data/users';

export const getUsersCacheKey = (projectId: string) => [
  'project',
  projectId,
  'users',
];

export const getQueryKeyUser = (projectId: string, userId: number) => [
  userId,
  projectId,
  'user',
];

export const invalidateGetUsersCache = (projectId: string) =>
  queryClient.invalidateQueries({
    queryKey: getUsersCacheKey(projectId),
  });

export const useAllUsers = (projectId: string) =>
  useQuery({
    queryKey: getUsersCacheKey(projectId),
    queryFn: () => getAllUsers(projectId),
  });

export const useUsers = (
  projectId: string,
  filterWithCredentials?: boolean,
) => {
  const { data: users, isPending } = useAllUsers(projectId);

  const allUsersQueries = useQueries({
    queries: (users || [])?.map((user) => ({
      queryKey: [...getUsersCacheKey(projectId), user.id, 's3Credentials'],
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
          search: `${user.username} ${user.description} ${user.creationDate} ${
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

export const usePaginatedUsers = (
  projectId: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const { validUsersWithCredentials, error, isLoading, isPending } = useUsers(
    projectId,
    true,
  );

  return useMemo(
    () => ({
      isLoading,
      isPending,
      paginatedUsers: paginateResults<TUser>(
        sortResults<TUser>(
          applyFilters<TUser>(validUsersWithCredentials || [], filters),
          sorting,
        ),
        pagination,
      ),
      refetch: () => invalidateGetUsersCache(projectId),
      error,
    }),
    [
      validUsersWithCredentials,
      error,
      isLoading,
      isPending,
      pagination,
      sorting,
      filters,
    ],
  );
};

type DeleteUserProps = {
  projectId: string;
  userId: number;
  access: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useGetUser = (projectId: string, userId: number) => {
  const { data: users, isPending } = useUsers(projectId);

  const user = useMemo(() => users?.find((u) => u.id === userId), [
    users,
    isPending,
  ]);

  return { user, isPending };
};

export const useDeleteUser = ({
  projectId,
  userId,
  access,
  onError,
  onSuccess,
}: DeleteUserProps) => {
  const mutation = useMutation({
    mutationFn: () => deleteUser(projectId, userId, access),
    onError,
    onSuccess: () => {
      invalidateGetUsersCache(projectId);
      onSuccess();
    },
  });

  return {
    deleteUser: () => mutation.mutate(),
    ...mutation,
  };
};

type UsePostS3SecretParams = {
  projectId: string;
  userId: number;
  userAccess: string;
  onSuccess: ({ secret }: { secret: string }) => void;
  onError?: (cause: ApiError) => void;
};

export const usePostS3Secret = ({
  projectId,
  userId,
  userAccess,
  onSuccess,
  onError,
}: UsePostS3SecretParams) => {
  const mutation = useMutation({
    mutationFn: () => postS3Secret(projectId, userId, userAccess),
    onError,
    onSuccess,
  });

  return {
    postS3Secret: () => mutation.mutate(),
    ...mutation,
  };
};

type UseGenerateCredentialsParams = {
  projectId: string;
  onSuccess: (credentials: TS3Credentials) => void;
  onError?: (cause: ApiError) => void;
};

export const useGenerateS3Credentials = ({
  projectId,
  onSuccess,
  onError,
}: UseGenerateCredentialsParams) => {
  const mutation = useMutation({
    mutationFn: (userId: number) => generateS3Credentials(projectId, userId),
    onSuccess: (credentials) => {
      onSuccess(credentials);
      invalidateGetUsersCache(projectId);
    },
    onError,
  });

  return {
    generateS3Credentials: (userId: number) => mutation.mutate(userId),
    ...mutation,
  };
};

type ImportPolicyProps = {
  projectId: string;
  userId: string;
  files: File[];
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

const readFileAsJSON = (file: File, t: TFunction): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reject(
        new Error(
          t(
            'pci_projects_project_storages_containers_users_import_read_page_error',
          ),
        ),
      );
    };

    reader.onload = () => {
      if (isJson(reader.result.toString())) {
        resolve(reader.result.toString());
      }
    };

    reader.readAsText(file);
  });
};

export const useImportPolicy = ({
  projectId,
  userId,
  files,
  onError,
  onSuccess,
}: ImportPolicyProps) => {
  const [isPending, setIsPending] = useState(false);
  const { t } = useTranslation('objects/users/import-policy');

  const importPolicy = async () => {
    try {
      setIsPending(true);
      const policy = await readFileAsJSON(files[0], t);

      importUserPolicy(projectId, userId, policy);
      onSuccess();
    } catch (e) {
      onError(e as Error);
    } finally {
      setIsPending(false);
    }
  };
  return {
    isPending,
    importPolicy,
  };
};
