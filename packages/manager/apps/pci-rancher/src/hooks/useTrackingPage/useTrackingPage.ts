import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';
import { TRACKING_PATH, TrackingPageView } from '@/utils/tracking';

const MANAGER_PUBLIC_CLOUD = '86';

export const useSimpleTrackingAction = () => {
  const tracking = useTracking();

  return (trackingName: string) =>
    tracking.trackClick({
      name: trackingName,
      level2: MANAGER_PUBLIC_CLOUD,
      type: 'action',
    });
};

export const useSimpleTrackingPage = () => {
  const tracking = useTracking();

  return (trackingName: string) =>
    tracking.trackPage({
      name: trackingName,
      level2: MANAGER_PUBLIC_CLOUD,
    });
};

export const useTrackingPage = (page?: TrackingPageView) => {
  const trackPage = useSimpleTrackingPage();

  useEffect(() => {
    trackPage(`${TRACKING_PATH}${page ? `::${page}` : ''}`);
  }, [page]);
};

export const useTrackingAction = () => {
  const trackAction = useSimpleTrackingAction();

  return (page?: TrackingPageView, action?: string) =>
    trackAction(`${TRACKING_PATH}${page ? `::${page}` : ''}::${action}`);
};
