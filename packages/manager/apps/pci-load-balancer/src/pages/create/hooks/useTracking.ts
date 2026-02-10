import { useCallback } from 'react';

import { useTracking as UseTracking } from '@ovh-ux/manager-react-shell-client';

import { LOAD_BALANCER_CREATION_TRACKING } from '@/constants';

export const useTracking = () => {
  const { trackClick, trackPage } = UseTracking();

  const trackStep = useCallback(
    (step: number) => {
      const key = `FINISH_STEP_${step}` as keyof typeof LOAD_BALANCER_CREATION_TRACKING;
      trackClick({
        name: LOAD_BALANCER_CREATION_TRACKING[key],
        type: 'action',
      });
    },
    [trackClick],
  );

  return {
    trackStep,
    trackClick,
    trackPage,
  };
};
