import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  DatagridColumn,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import {
  IamServiceAccount,
  IamServiceAccountCreationPayload,
  IamServiceAccountCreationResponse,
  IamServiceAccountUpdatePayload,
  oauthClientsRoute,
  getIamServiceAccount,
  createIamServiceAccount,
  updateIamServiceAccount,
} from '@/data/api/iam-service-accounts';
import queryClient from '@/queryClient';

export const getIamServiceAccountListQueryKey = () => ['/me/api/oauth2/client'];

export const useIamServiceAccountList = ({
  columns,
  pageSize,
}: {
  columns: DatagridColumn<IamServiceAccount>[];
  pageSize: number;
}) => {
  return useResourcesIcebergV6<IamServiceAccount>({
    route: oauthClientsRoute,
    queryKey: getIamServiceAccountListQueryKey(),
    columns,
    pageSize,
  });
};

export const getIamServiceAccountQueryKey = (clientId: string) => [
  oauthClientsRoute,
  clientId,
];

export const useGetIamServiceAccount = ({ clientId }: { clientId: string }) => {
  return useQuery<IamServiceAccount, ApiError>({
    queryKey: getIamServiceAccountQueryKey(clientId),
    enabled: !!clientId,
    queryFn: () => getIamServiceAccount(clientId),
  });
};

export const useCreateIamServiceAccount = ({
  onSuccess,
  onError,
}: {
  onSuccess: (response: IamServiceAccountCreationResponse) => void;
  onError: (error: ApiError, payload: IamServiceAccountCreationPayload) => void;
}) => {
  const mutation = useMutation({
    mutationFn: (payload: IamServiceAccountCreationPayload) =>
      createIamServiceAccount(payload),
    onError,
    onSuccess: (response: IamServiceAccountCreationResponse) => {
      void queryClient.invalidateQueries({
        queryKey: getIamServiceAccountQueryKey(response.clientId),
      });
      void queryClient.invalidateQueries({
        queryKey: getIamServiceAccountListQueryKey(),
      });
      onSuccess(response);
    },
  });
  return {
    createServiceAccount: (payload: IamServiceAccountCreationPayload) =>
      mutation.mutate(payload),
    ...mutation,
  };
};

export const useUpdateIamServiceAccount = ({
  clientId,
  onSuccess,
  onError,
}: {
  clientId: string;
  onSuccess: (account: IamServiceAccount) => void;
  onError: (error: ApiError, payload: IamServiceAccountUpdatePayload) => void;
}) => {
  const mutation = useMutation({
    mutationFn: (payload: IamServiceAccountUpdatePayload) =>
      updateIamServiceAccount(clientId, payload),
    onError,
    onSuccess: (account: IamServiceAccount) => {
      void queryClient.invalidateQueries({
        queryKey: getIamServiceAccountQueryKey(account.clientId),
      });
      void queryClient.invalidateQueries({
        queryKey: getIamServiceAccountListQueryKey(),
      });
      onSuccess(account);
    },
  });
  return {
    updateServiceAccount: (payload: IamServiceAccountUpdatePayload) =>
      mutation.mutate(payload),
    ...mutation,
  };
};
