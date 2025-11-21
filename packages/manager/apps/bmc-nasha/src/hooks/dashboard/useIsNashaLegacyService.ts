import { useMemo } from 'react';

import { useNashaDetail } from './useNashaDetail';

/**
 * Hook to check if service is a legacy NASHA service
 * Equivalent to isNashaLegacyService resolve in dashboard.routing.js
 */
export function useIsNashaLegacyService(serviceName: string) {
  const { data: nasha } = useNashaDetail(serviceName);

  return useMemo(() => {
    if (!nasha) {
      return false;
    }

    const { datacenter, diskType } = nasha;
    return ['rbx', 'sbg', 'bhs'].includes(datacenter) && diskType === 'hdd';
  }, [nasha]);
}
