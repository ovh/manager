import * as database from '@/types/cloud/project/database';
import { useGetAvailabilities } from './useGetAvailabilities.hook';

/**
 * Fetch the current service availability through the 'self' target with no
 * status filter. Unlike the status-filtered availability queries, this always
 * returns the current configuration, even when the service is EOS/EOL.
 *
 * The API requires an `action` alongside `target=self`. We always use `update`:
 * its result set includes the current availability (which `target=self` narrows
 * down to), and it is the combination the backend supports — `action=fork`
 * with `target=self` returns a 500. All call sites therefore share one query.
 */
export function useGetCurrentAvailability(projectId: string, serviceId: string) {
  return useGetAvailabilities(
    projectId,
    serviceId,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.self,
    [],
  );
}
