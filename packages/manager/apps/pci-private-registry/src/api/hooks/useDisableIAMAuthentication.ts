import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllRegistriesQueryKey,
  getRegistryIAMQueryKey,
} from './useRegistry';
import { disableIAMAuthentication } from '../data/IAM';
import { TRegistry } from '../data/registry';

export type DisableIAMMutationParams = {
  projectId: string;
  registryId: string;
};

export const useDisableIAMAuthentication = ({ onError, onSuccess }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ projectId, registryId }: DisableIAMMutationParams) =>
      disableIAMAuthentication(projectId, registryId),
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
    disableIAMAuthentication: ({
      projectId,
      registryId,
    }: DisableIAMMutationParams) => mutation.mutate({ projectId, registryId }),
    ...mutation,
  };
};
