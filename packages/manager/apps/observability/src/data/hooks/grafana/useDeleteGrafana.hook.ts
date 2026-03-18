import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteGrafana } from '@/__mocks__/grafana/grafana.adapter';
import type { GetGrafanaPayload } from '@/data/api/grafana.props';
import { getGrafanaQueryKey, getGrafanasQueryKey } from '@/data/hooks/grafana/useGrafana.hook';
import { Grafana } from '@/types/managedDashboards.type';

export const useDeleteGrafana = (
  mutationOptions?: Omit<UseMutationOptions<Grafana, Error, GetGrafanaPayload>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restOptions } = mutationOptions ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: (payload: GetGrafanaPayload) => deleteGrafana(payload),
    onSuccess: (deletedGrafana, variables, context) => {
      void queryClient.invalidateQueries({
        queryKey: getGrafanasQueryKey(variables.resourceName),
      });

      queryClient.setQueryData<Grafana>(
        getGrafanaQueryKey(variables.resourceName, variables.grafanaId),
        deletedGrafana,
      );
      onSuccess?.(deletedGrafana, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
  });
};
