import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getAllRegistriesQueryKey, getRegistryQueryKey } from './useRegistry';
import { disableIAMAuthentication, enableIAMAuthentication } from '../data/IAM';
import { TRegistry } from '../data/registry';
import { TRegistryActionToggle } from '@/types';

export type TIAMMutationParams = {
  projectId: string;
  registryId: string;
  deleteUsers?: boolean | null;
};

type TIAMArgs = {
  action: TRegistryActionToggle;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
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
  queryClient.invalidateQueries({
    queryKey: getRegistryQueryKey(projectId, registryId),
  });
};

export const useToggleIAMAuthentication = ({
  action,
  onSuccess,
  onError,
}: TIAMArgs) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ projectId, registryId, deleteUsers }: TIAMMutationParams) =>
      action === 'ENABLE'
        ? enableIAMAuthentication(projectId, registryId, deleteUsers)
        : disableIAMAuthentication(projectId, registryId),
    onError,
    onSuccess: (_data, { projectId, registryId }) => {
      handleIAMMutationSuccess(queryClient, projectId, registryId);
      onSuccess?.();
    },
  });

  return {
    toggleIAMAuthentication: ({
      projectId,
      registryId,
      deleteUsers,
    }: TIAMMutationParams) =>
      mutation.mutate({
        projectId,
        registryId,
        ...(action === 'ENABLE' && { deleteUsers }),
      }),
    ...mutation,
  };
};
