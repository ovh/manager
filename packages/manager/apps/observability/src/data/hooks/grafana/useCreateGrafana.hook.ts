import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { createGrafana } from '@/__mocks__/grafana/grafana.adapter';
import { CreateGrafanaPayload } from '@/data/api/grafana.props';
import { getGrafanasQueryKey } from '@/data/hooks/grafana/useGrafana.hook';
import { Grafana } from '@/types/managedDashboards.type';

export const useCreateGrafana = (
  mutationOptions?: Omit<UseMutationOptions<Grafana, Error, CreateGrafanaPayload>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restOptions } = mutationOptions ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: (payload: CreateGrafanaPayload) => createGrafana(payload),
    onSuccess: (grafana, variables, context) => {
      // Invalidate and refetch grafanas list for the specific resource
      void queryClient.invalidateQueries({
        queryKey: getGrafanasQueryKey(variables.resourceName),
      });
      onSuccess?.(grafana, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
  });
};
