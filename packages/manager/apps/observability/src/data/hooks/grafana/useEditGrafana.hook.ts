import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { editGrafana } from '@/__mocks__/grafana/grafana.adapter';
import type { EditGrafanaPayload } from '@/data/api/grafana.props';
import { getGrafanaQueryKey, getGrafanasQueryKey } from '@/data/hooks/grafana/useGrafana.hook';
import { Grafana } from '@/types/managedDashboards.type';

export const useEditGrafana = (
  mutationOptions?: Omit<UseMutationOptions<Grafana, Error, EditGrafanaPayload>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restOptions } = mutationOptions ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: (payload: EditGrafanaPayload) => editGrafana(payload),
    onSuccess: (updatedGrafana, variables, context) => {
      void queryClient.invalidateQueries({
        queryKey: getGrafanasQueryKey(variables.resourceName),
      });

      queryClient.setQueryData<Grafana>(
        getGrafanaQueryKey(variables.resourceName, variables.grafanaId),
        updatedGrafana,
      );
      onSuccess?.(updatedGrafana, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
  });
};
