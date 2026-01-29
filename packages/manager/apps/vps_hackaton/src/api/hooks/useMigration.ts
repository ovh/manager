import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vpsMigrationQueryKey } from '@/adapters/tanstack/vps/vps.queryKey';
import {
  checkMigrationEligibility,
  requestMigration,
  cancelMigration,
  type TMigrationEligibility,
} from '@/api/data/migration.api';
import type { TSelectOptions } from './types';

export const useMigrationEligibility = <TData = TMigrationEligibility>(
  serviceName: string,
  { select }: TSelectOptions<TMigrationEligibility, TData> = {},
) => {
  return useQuery({
    queryKey: vpsMigrationQueryKey(serviceName),
    queryFn: () => checkMigrationEligibility(serviceName),
    select,
    enabled: !!serviceName,
  });
};

export const useRequestMigration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestMigration,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsMigrationQueryKey(variables.serviceName),
      });
    },
  });
};

export const useCancelMigration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMigration,
    onSuccess: (_, serviceName) => {
      queryClient.invalidateQueries({
        queryKey: vpsMigrationQueryKey(serviceName),
      });
    },
  });
};
