import {
  GroupedInfrastructures,
  Infrastructure,
  InfrastructureWithLocation,
} from '@/types/infrastructures.type';
import { ALL_ZONE } from '@/utils/infrastructures.constants';

const hasLocationDetails = (
  infrastructure: Infrastructure,
): infrastructure is InfrastructureWithLocation => {
  return !!infrastructure.locationDetails;
};

/**
 * Group infrastructures by geographic zone.
 * @param infrastructures - The infrastructures to group by geographic zone.
 * @returns A record of infrastructures grouped by geographic zone and an all array.
 * @example
 * ```ts
 * const infrastructures = [
 *   { id: '1', locationDetails: { geographyCode: 'eu' } },
 *   { id: '2', locationDetails: { geographyCode: 'us' } },
 * ];
 * const groupedInfrastructures = groupByGeographicZone(infrastructures);
 * console.log(groupedInfrastructures);
 * // { eu: [{ id: '1', locationDetails: { geographyCode: 'eu' } }], us: [{ id: '2', locationDetails: { geographyCode: 'us' } }], all: [{ id: '1', locationDetails: { geographyCode: 'eu' } }, { id: '2', locationDetails: { geographyCode: 'us' } }] }
 */

export const groupByGeographicZone = (
  infrastructures: Infrastructure[] | undefined,
): GroupedInfrastructures => {
  const initial: GroupedInfrastructures = { [ALL_ZONE]: [] };

  if (!infrastructures || infrastructures.length === 0) {
    return initial;
  }

  return infrastructures
    .filter(hasLocationDetails)
    .reduce((acc, infrastructure: InfrastructureWithLocation) => {
      const geographicZone = infrastructure.locationDetails.geographyCode.toLowerCase();

      acc[ALL_ZONE].push(infrastructure);
      (acc[geographicZone] ??= []).push(infrastructure);

      return acc;
    }, initial);
};

/**
 * Get the zones from the grouped infrastructures - ALL_ZONE first, then other zones.
 * @param groupedInfrastructures - The grouped infrastructures.
 * @returns The zones- ALL_ZONE first, then other zones.
 * @example
 * ```ts
 * const groupedInfrastructures = { eu: [{ id: '1', locationDetails: { geographyCode: 'eu' } }], us: [{ id: '2', locationDetails: { geographyCode: 'us' } }], all: [{ id: '1', locationDetails: { geographyCode: 'eu' } }, { id: '2', locationDetails: { geographyCode: 'us' } }] };
 * const zones = getZones(groupedInfrastructures);
 * console.log(zones);
 * // ['all', 'eu', 'us']
 */
export const getZones = (groupedInfrastructures: GroupedInfrastructures | undefined) => {
  if (!groupedInfrastructures) {
    return [];
  }
  const keys = Object.keys(groupedInfrastructures);
  // Put 'all' first, then other zones
  return keys.includes(ALL_ZONE) ? [ALL_ZONE, ...keys.filter((key) => key !== ALL_ZONE)] : keys;
};
