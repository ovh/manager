import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { FEATURE_AVAILABILITY } from '@/constants';

/**
 * Check if HDS feature availability is enabled
 */
export const useIsHdsFeatureAvailabilityEnabled = (): boolean => {
  const { data: availability } = useFeatureAvailability([
    FEATURE_AVAILABILITY.HDS,
  ]);
  return Boolean(availability?.[FEATURE_AVAILABILITY.HDS]);
};

/**
 * Check Hds support Level eligibility
 * Only 'enterprise' and 'business' levels are eligible for HDS
 */
export const useIsAValidHdsSupportLevel = () => {
  const { supportLevel } = useContext(ShellContext).environment.getUser();
  return useMemo(
    () => ['enterprise', 'business'].includes(supportLevel?.level),
    [supportLevel],
  );
};
