import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllRegistriesQueryKey,
  getRegistryIAMQueryKey,
} from './useRegistry';
import { enableIAMAuthentication } from '../data/IAM';
import { TRegistry } from '../data/registry';

export type EnableIAMMutationParams = {
  projectId: string;
  registryId: string;
  deleteUsers: boolean | null;
};

export const useEnableIAMAuthentication = ({ onError, onSuccess }) => {
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
        queryKey: [...getRegistryIAMQueryKey(projectId, registryId)],
      });
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
