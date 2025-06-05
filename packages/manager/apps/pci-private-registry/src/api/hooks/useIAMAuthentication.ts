import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getAllRegistriesQueryKey } from './useRegistry';
import { disableIAMAuthentication, enableIAMAuthentication } from '../data/IAM';
import { TRegistry } from '../data/registry';

export type IAMMutationParams = {
  projectId: string;
  registryId: string;
};

type IAMOptions = {
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export type EnableIAMMutationParams = IAMMutationParams & {
  deleteUsers: boolean | null;
};

const handleIAMMutationSuccess = (
  queryClient: QueryClient,
  projectId: string,
  registryId: string,
) => {
  queryClient.setQueryData(
    getAllRegistriesQueryKey(projectId),
    (data: TRegistry[] | undefined) => {
      if (!data) return undefined;
      return data.map((registry) =>
        registry.id === registryId
          ? { ...registry, iamEnabled: !registry.iamEnabled }
          : registry,
      );
    },
  );
};

export const useEnableIAMAuthentication = ({
  onSuccess,
  onError,
}: IAMOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      projectId,
      registryId,
      deleteUsers,
    }: EnableIAMMutationParams) =>
      enableIAMAuthentication(projectId, registryId, deleteUsers),
    onError,
    onSuccess: (_data, { projectId, registryId }) => {
      handleIAMMutationSuccess(queryClient, projectId, registryId);
      onSuccess?.();
    },
  });

  return {
    enableIAMAuthentication: ({
      projectId,
      registryId,
      deleteUsers,
    }: EnableIAMMutationParams) =>
      mutation.mutate({ projectId, registryId, deleteUsers }),
    ...mutation,
  };
};

export const useDisableIAMAuthentication = ({
  onSuccess,
  onError,
}: IAMOptions) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ projectId, registryId }: IAMMutationParams) =>
      disableIAMAuthentication(projectId, registryId),
    onError,
    onSuccess: (_data, { projectId, registryId }) => {
      handleIAMMutationSuccess(queryClient, projectId, registryId);
      onSuccess?.();
    },
  });

  return {
    disableIAMAuthentication: ({ projectId, registryId }: IAMMutationParams) =>
      mutation.mutate({ projectId, registryId }),
    ...mutation,
  };
};
