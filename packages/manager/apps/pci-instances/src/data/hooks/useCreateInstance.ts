import { instanceCreationMutationKey } from '@/adapters/tanstack/instances/mutationKeys';
import { TCreateInstanceDTO } from '@/adapters/tanstack/instances/right/dto.type';
import { instanceAdapter } from '@/adapters/tanstack/instances/right/instanceAdapter';
import { useMutation } from '@tanstack/react-query';

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

  return useMutation({
    mutationKey: instanceCreationMutationKey(projectId),
    mutationFn: ({ regionName, instance }: TUseCreateInstanceMutationFnArgs) =>
      instanceAdapter.createInstance({ projectId, regionName, instance }),
    onSuccess,
    onError,
  });
};
