import { useMemo } from 'react';
import * as database from '@/types/cloud/project/database';
import { mergeCurrentAvailability } from '@/lib/availabilitiesHelper';
import { useGetAvailabilities } from './useGetAvailabilities.hook';
import { useGetCurrentAvailability } from './useGetCurrentAvailability.hook';

/**
 * Fetch the availabilities for an update target and merge in the current
 * service availability (fetched through the 'self' target with no status
 * filter). The update endpoint only returns STABLE/BETA availabilities, so an
 * EOS/EOL service is filtered out of its own results. Merging the 'self'
 * availability guarantees the current configuration is always present, which
 * the update modals need to display the current plan/flavor and compute the
 * current price. The current availability is also returned so the caller can
 * warn the user when it is EOS/EOL.
 */
export function useGetUpdateAvailabilities(
  projectId: string,
  serviceId: string,
  target: database.availability.TargetEnum,
) {
  const availabilitiesQuery = useGetAvailabilities(
    projectId,
    serviceId,
    database.availability.ActionEnum.update,
    target,
  );
  const currentAvailabilityQuery = useGetCurrentAvailability(
    projectId,
    serviceId,
  );
  const availabilities = useMemo(() => {
    if (!availabilitiesQuery.data) return availabilitiesQuery.data;
    return mergeCurrentAvailability(
      availabilitiesQuery.data,
      currentAvailabilityQuery.data,
    );
  }, [availabilitiesQuery.data, currentAvailabilityQuery.data]);
  return {
    availabilities,
    currentAvailability: currentAvailabilityQuery.data?.[0],
  };
}
