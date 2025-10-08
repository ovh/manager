import { createContext } from 'react';

import { User } from '@ovh-ux/manager-config';
import {
  TrackingClickParams,
  TrackingPageParams,
} from '@ovh-ux/manager-react-shell-client';

import { AdditionalTrackingParams } from '@/types/tracking';

export type TrackingContext = {
  setUser: (user: User) => void;
  trackPage: (params: TrackingPageParams & AdditionalTrackingParams) => void;
  trackClick: (
    page: TrackingPageParams,
    {
      location,
      buttonType,
      actions,
      actionType,
      pageCategory,
    }: TrackingClickParams & AdditionalTrackingParams,
  ) => void;
};

const trackingContext = createContext<TrackingContext | undefined>(undefined);

export default trackingContext;
