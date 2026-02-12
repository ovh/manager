import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createShareAdapter } from '@/adapters/apiV6/share/createShare.adapter';
import { sharesQueryKey } from '@/adapters/shares/queryKeys';
import {
  CreateShareCommand,
  createShareUseCase,
} from '@/application/useCases/createShare/createShare.useCase';

export const useCreateShare = ({
  projectId,
  onSuccess,
  onError,
}: {
  projectId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  const createShare = createShareUseCase(createShareAdapter, projectId);

  const mutation = useMutation<void, Error, CreateShareCommand>({
    mutationFn: async (command: CreateShareCommand): Promise<void> => createShare(command),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: sharesQueryKey(projectId),
      });

      onSuccess();
    },
    onError,
  });

  return {
    createShare: mutation.mutate,
    ...mutation,
  };
};
