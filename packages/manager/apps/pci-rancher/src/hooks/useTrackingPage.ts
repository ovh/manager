import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';
import { TRACKING_PATH, TrackingPageView } from '@/utils/tracking';

export const useTrackingPage = (page?: TrackingPageView) => {
  const tracking = useTracking();

  useEffect(() => {
    tracking.trackPage({
      name: `${TRACKING_PATH}${page ? `::${page}` : ''}`,
      level2: '86', // Manager-PublicCloud
    });
  }, [page]);
};

export const useTrackingAction = () => {
  const tracking = useTracking();

  return (page?: TrackingPageView, action?: string) =>
    tracking.trackClick({
      name: `${TRACKING_PATH}${page ? `::${page}` : ''}::${action}`,
      level2: '86', // Manager-PublicCloud
    });
};
