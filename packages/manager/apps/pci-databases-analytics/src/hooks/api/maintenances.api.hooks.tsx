import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { database } from '@/models/database';
import { CdbError } from '@/api/databases';
import {
  ApplyMaintenanceProps,
  applyMaintenance,
  getMaintenances,
} from '@/api/databases/maintenances';

export function useGetMaintenances(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'maintenance'];
  return useQuery({
    queryKey,
    queryFn: () => getMaintenances({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.Maintenance[], Error>;
}

export interface MutateMaintenanceProps {
  onError: (cause: CdbError) => void;
  onSuccess: (maintenance: database.service.Maintenance) => void;
}

export function useApplyMaintenance({
  onError,
  onSuccess,
}: MutateMaintenanceProps) {
  const mutation = useMutation({
    mutationFn: (mtInfo: ApplyMaintenanceProps) => {
      return applyMaintenance(mtInfo);
    },
    onError,
    onSuccess,
  });

  return {
    applyMaintenance: (mtInfo: ApplyMaintenanceProps) => {
      return mutation.mutate(mtInfo);
    },
    ...mutation,
  };
}
