import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { updateVcdaMigrationWhitelist } from '@ovh-ux/manager-module-vcd-api';
import { getVcdaMigrationQueryKey } from './vcdaQueryKey';
import { getVcdaStatusQueryKey } from './useVcdaStatus.hook';

export const useUpdateVcdaWhitelist = ({
  orgId,
  migrationId,
  onSuccess,
  ...options
}: {
  orgId: string;
  migrationId: string;
} & Partial<UseMutationOptions<unknown, ApiError, string[], unknown>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ips: string[]) =>
      updateVcdaMigrationWhitelist(migrationId, { ips }),
    onSuccess: (...params) => {
      // Both VCDA caches must refresh: the migration page (useVcdaMigration) and
      // the tile/tab gate (useVcdaStatus) — a PUT moves the entity to UPDATING.
      queryClient.invalidateQueries({
        queryKey: getVcdaMigrationQueryKey(orgId),
      });
      queryClient.invalidateQueries({
        queryKey: getVcdaStatusQueryKey(orgId),
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
