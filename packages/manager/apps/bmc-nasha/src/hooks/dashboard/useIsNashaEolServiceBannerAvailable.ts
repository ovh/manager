import { useMemo } from 'react';

import { useFeatureAvailability } from '@ovh-ux/manager-react-shell-client';

import { useIsNashaLegacyService } from './useIsNashaLegacyService';

const FEATURE_ID = 'dedicated-nasha:eol-lv1-lv2';

/**
 * Hook to check if EOL banner should be displayed
 * Equivalent to isNashaEolServiceBannerAvailable resolve in dashboard.routing.js
 */
export function useIsNashaEolServiceBannerAvailable(serviceName: string) {
  const { data: features } = useFeatureAvailability([FEATURE_ID]);
  const isNashaLegacyService = useIsNashaLegacyService(serviceName);

  return useMemo(() => {
    const isNashaLegacyServicesPeriod = features?.[FEATURE_ID]?.isFeatureAvailable(FEATURE_ID);
    return isNashaLegacyServicesPeriod && isNashaLegacyService;
  }, [features, isNashaLegacyService]);
}



