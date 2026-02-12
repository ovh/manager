import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sharesQueryKey } from '@/adapters/shares/queryKeys';
import { createShare } from '@/data/api/shares.api';
import { TShareToCreate } from '@/domain/entities/share.entity';
import { isShareToCreateValid } from '@/domain/services/share.service';

export type CreateShareCommand = {
  name: string;
  type: string;
  networkId: string;
  size: number;
  region: string;
  subnetId: string;
};

const mapCommandToEntity = (command: CreateShareCommand): TShareToCreate => ({
  name: command.name,
  type: command.type,
  network: { id: command.networkId },
  size: command.size,
  region: command.region,
});

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

  const mutation = useMutation<void, Error, CreateShareCommand>({
    mutationFn: async (command: CreateShareCommand): Promise<void> => {
      const shareToCreate = mapCommandToEntity(command);

      if (!isShareToCreateValid(shareToCreate)) {
        throw new Error('Invalid create share configuration');
      }

      await createShare({ projectId, shareToCreate });
    },
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
