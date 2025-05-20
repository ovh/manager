import { useEffect, ReactNode } from 'react';
import {
  useOvhTracking,
  TrackingPageParams,
} from '@ovh-ux/manager-react-shell-client';

export type TTrackedNotificationProps = {
  notification: ReactNode | string;
  trackingParams: TrackingPageParams;
};

export default function TrackedNotification({
  notification,
  trackingParams,
}: TTrackedNotificationProps) {
  const { trackPage } = useOvhTracking();
  useEffect(() => {
    trackPage(trackingParams);
  }, []);
  return <>{notification}</>;
}
