import { useCallback } from 'react';
import { useTracking as UseTracking } from '@ovh-ux/manager-react-shell-client';
import { LOAD_BALANCER_CREATION_TRACKING } from '@/constants';

export const useTracking = () => {
  const { trackClick, trackPage } = UseTracking();

  const trackStep = useCallback(
    (step: number) => {
      trackClick({
        name: LOAD_BALANCER_CREATION_TRACKING[`FINISH_STEP_${step}`],
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
