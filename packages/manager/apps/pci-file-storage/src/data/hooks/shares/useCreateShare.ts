import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sharesQueryKey } from '@/adapters/shares/queryKeys';
import { TCreateSharePayload } from '@/data/api/schema/share.schema';
import { createShare } from '@/data/api/shares.api';

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

  const mutation = useMutation({
    mutationFn: ({ region, payload }: { region: string; payload: TCreateSharePayload }) =>
      createShare({ projectId, region, payload }),
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
