/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Nasha, ServiceInfo } from '@/types/Dashboard.type';

import { SIZE_MIN } from '@/pages/dashboard/Dashboard.constants';

/**
 * Calculates if user should be re-engaged based on engagement date
 * Returns true if engagedUpTo is less than 3 months from now
 */
export function shouldReengage(serviceInfo: ServiceInfo): boolean {
  if (!serviceInfo.engagedUpTo) {
    return false;
  }

  const engagedDate = new Date(serviceInfo.engagedUpTo);
  const now = new Date();
  const diffMonths =
    (engagedDate.getFullYear() - now.getFullYear()) * 12 +
    (engagedDate.getMonth() - now.getMonth());

  return diffMonths < 3;
}

/**
 * Calculates if partitions can be created based on allocated size
 */
export function canCreatePartitions(
  partitionAllocatedSize: number,
  nasha: Nasha,
): boolean {
  return partitionAllocatedSize <= nasha.zpoolSize - SIZE_MIN;
}

/**
 * Checks if service is a legacy service (EOL)
 * Legacy services are in datacenters ['rbx', 'sbg', 'bhs'] with diskType 'hdd'
 */
export function isNashaLegacyService(nasha: Nasha): boolean {
  const { datacenter, diskType } = nasha;
  return ['rbx', 'sbg', 'bhs'].includes(datacenter) && diskType === 'hdd';
}

