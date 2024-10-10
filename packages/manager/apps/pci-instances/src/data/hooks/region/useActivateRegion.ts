import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { DeepReadonly } from '@/types/utils.type';
import { activateRegion } from '@/data/api/region';
import { TActivatedRegionDto } from '@/types/region/api.types';

export type TUseActivateRegionCallbacks = DeepReadonly<{
  onSuccess?: (region: string) => void;
  onError?: (error: unknown) => void;
}>;

export const useActivateRegion = (
  projectId: string,
  { onError, onSuccess }: TUseActivateRegionCallbacks = {},
) => {
  const mutationFn = useCallback(
    (region: string) => activateRegion(projectId, region),
    [projectId],
  );

  const handleSuccess = useCallback(
    (data: TActivatedRegionDto) => {
      if (onSuccess) onSuccess(data.name);
    },
    [onSuccess],
  );

  const mutation = useMutation<TActivatedRegionDto, unknown, string, unknown>({
    mutationFn,
    onError,
    onSuccess: handleSuccess,
  });

  return {
    activateRegion: mutation.mutate,
    ...mutation,
  };
};
