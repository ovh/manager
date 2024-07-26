import { useMutation } from '@tanstack/react-query';

import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';
import {
  ApplyMaintenance,
  applyMaintenance,
} from '@/data/api/database/maintenance.api';

export interface MutateMaintenanceProps {
  onError: (cause: CdbError) => void;
  onSuccess: (maintenance: database.service.Maintenance) => void;
}

export function useApplyMaintenance({
  onError,
  onSuccess,
}: MutateMaintenanceProps) {
  const mutation = useMutation({
    mutationFn: (mtInfo: ApplyMaintenance) => {
      return applyMaintenance(mtInfo);
    },
    onError,
    onSuccess,
  });

  return {
    applyMaintenance: (mtInfo: ApplyMaintenance) => {
      return mutation.mutate(mtInfo);
    },
    ...mutation,
  };
}
