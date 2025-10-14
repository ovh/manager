import * as database from '@/types/cloud/project/database';
import { getAvailabilities } from '@/data/api/database/availability.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetAvailabilities(
  projectId: string,
  serviceId?: string,
  action?: database.availability.ActionEnum,
  target?: database.availability.TargetEnum,
  options?: OptionsFor<typeof getAvailabilities>,
) {
  const queryKey = [
    projectId,
    'database/availability',
    serviceId,
    action,
    target,
  ].filter(Boolean);
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getAvailabilities({
        projectId,
        ...(serviceId ? { serviceId } : {}),
        ...(action ? { action } : {}),
        ...(target ? { target } : {}),
      }),
    ...options,
  });
}
