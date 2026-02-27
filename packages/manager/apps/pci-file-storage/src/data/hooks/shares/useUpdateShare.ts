import { useMutation, useQueryClient } from '@tanstack/react-query';

import { shareDetailsQueryKey, sharesQueryKey } from '@/adapters/shares/queryKeys';
import { updateShare } from '@/data/api/shares.api';

export type UpdateShareCommand = {
  name: string;
};

export const useUpdateShare = ({
  projectId,
  shareId,
  region,
}: {
  projectId: string;
  shareId: string;
  region: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateShareCommand>({
    mutationFn: async (command: UpdateShareCommand): Promise<void> => {
      await updateShare({ projectId, shareId, region, name: command.name });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: shareDetailsQueryKey(projectId, region, shareId),
      });
      void queryClient.invalidateQueries({
        queryKey: sharesQueryKey(projectId),
      });
    },
  });
};
