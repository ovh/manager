import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { editObservabilityService } from '@/data/api/observability.api';
import type { EditObservabilityServicePayload } from '@/data/api/observability.props';
import { getObservabilityServicesQueryKey } from '@/data/hooks/services/useObservabilityServices.hook';
import { ObservabilityService } from '@/types/observability.type';

export const useEditObservabilityService = (
  mutationOptions?: Omit<
    UseMutationOptions<ObservabilityService, Error, EditObservabilityServicePayload>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restOptions } = mutationOptions ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: (payload: EditObservabilityServicePayload) => editObservabilityService(payload),
    onSuccess: (updatedService, variables, context) => {
      void queryClient.invalidateQueries({
        queryKey: getObservabilityServicesQueryKey(),
      });
      onSuccess?.(updatedService, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
  });
};
