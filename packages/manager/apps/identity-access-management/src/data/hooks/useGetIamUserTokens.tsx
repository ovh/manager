import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  DatagridColumn,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import {
  getIamUserToken,
  createIamUserToken,
  updateIamUserToken,
  deleteIamUserToken,
  IamUserToken,
  IamUserTokenPayload,
} from '@/data/api/iam-users';
import queryClient from '@/queryClient';

export const getIamUserTokenListQueryKey = (userId: string) => [
  '/me/identity/user',
  userId,
  'tokens',
];

export const useIamUserTokenList = ({
  userId,
  columns,
  pageSize,
}: {
  userId: string;
  columns: DatagridColumn<IamUserToken>[];
  pageSize: number;
}): ReturnType<typeof useResourcesIcebergV6<IamUserToken>> => {
  const route = `/me/identity/user/${userId}/token`;
  return useResourcesIcebergV6<IamUserToken>({
    route,
    queryKey: getIamUserTokenListQueryKey(userId),
    columns,
    pageSize,
  });
};

export const getIamUserTokenQueryKey = (userId: string, token: string) => [
  '/me/identity/user',
  userId,
  'tokens',
  token,
];

export const useGetIamUserToken = ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) => {
  return useQuery<IamUserToken, ApiError>({
    queryKey: getIamUserTokenQueryKey(userId, token),
    enabled: !!token,
    queryFn: () => getIamUserToken(userId, token),
  });
};

export const useCreateIamUserToken = ({
  userId,
  onSuccess,
  onError,
}: {
  userId: string;
  onSuccess: (payload: IamUserTokenPayload) => void;
  onError: (error: ApiError, payload: IamUserTokenPayload) => void;
}) => {
  const mutation = useMutation({
    mutationFn: (payload: IamUserTokenPayload) =>
      createIamUserToken(userId, payload),
    onError,
    onSuccess: (payload: IamUserTokenPayload) => {
      void queryClient.invalidateQueries({
        queryKey: getIamUserTokenQueryKey(userId, payload.name),
      });
      void queryClient.invalidateQueries({
        queryKey: getIamUserTokenListQueryKey(userId),
      });
      onSuccess(payload);
    },
  });
  return {
    createToken: (payload: IamUserTokenPayload) => mutation.mutate(payload),
    ...mutation,
  };
};

export const useUpdateIamUserToken = ({
  userId,
  onSuccess,
  onError,
}: {
  userId: string;
  onSuccess: (payload: IamUserTokenPayload) => void;
  onError: (error: ApiError, payload: IamUserTokenPayload) => void;
}) => {
  const mutation = useMutation({
    mutationFn: (payload: IamUserTokenPayload) =>
      updateIamUserToken(userId, payload),
    onError,
    onSuccess: (payload: IamUserTokenPayload) => {
      void queryClient.invalidateQueries({
        queryKey: getIamUserTokenQueryKey(userId, payload.name),
      });
      void queryClient.invalidateQueries({
        queryKey: getIamUserTokenListQueryKey(userId),
      });
      onSuccess(payload);
    },
  });
  return {
    updateToken: (payload: IamUserTokenPayload) => mutation.mutate(payload),
    ...mutation,
  };
};

export const useDeleteIamUserToken = ({
  userId,
  token,
  onSuccess,
  onError,
}: {
  userId: string;
  token: string;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}) => {
  const mutation = useMutation({
    mutationFn: () => deleteIamUserToken(userId, token),
    onError,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getIamUserTokenQueryKey(userId, token),
      });
      void queryClient.invalidateQueries({
        queryKey: getIamUserTokenListQueryKey(userId),
      });
      onSuccess();
    },
  });
  return {
    deleteToken: () => mutation.mutate(),
    ...mutation,
  };
};
