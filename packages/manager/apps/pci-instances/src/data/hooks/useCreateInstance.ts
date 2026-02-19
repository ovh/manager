import { instanceCreationMutationKey } from '@/adapters/tanstack/instances/mutationKeys';
import { TCreateInstanceDTO } from '@/adapters/tanstack/instances/right/dto.type';
import { instanceAdapter } from '@/adapters/tanstack/instances/right/instanceAdapter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { operationsQueryKey } from '@/adapters/tanstack/operations/queryKeys';

type TUseCreateInstanceCallbacks = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

type TUseCreateInstanceMutationFnArgs = {
  regionName: string;
  instance: TCreateInstanceDTO;
};

type TUseCreateInstanceParams = {
  projectId: string;
  callbacks?: TUseCreateInstanceCallbacks;
};

export const useCreateInstance = ({
  projectId,
  callbacks = {},
}: TUseCreateInstanceParams) => {
  const { onSuccess, onError } = callbacks;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: instanceCreationMutationKey(projectId),
    mutationFn: ({ regionName, instance }: TUseCreateInstanceMutationFnArgs) =>
      instanceAdapter.createInstance({ projectId, regionName, instance }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: operationsQueryKey(projectId),
      });
      onSuccess?.();
    },
    onError,
  });
};
