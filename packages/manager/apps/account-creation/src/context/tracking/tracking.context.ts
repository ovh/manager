import { createContext } from 'react';
import {
  TrackingClickParams,
  TrackingPageParams,
} from '@ovh-ux/manager-react-shell-client';
import { User } from '@ovh-ux/manager-config';

export type TrackingContext = {
  setUser: (user: User) => void;
  trackPage: (params: TrackingPageParams) => void;
  trackClick: (
    page: TrackingPageParams,
    { location, buttonType, actions, actionType }: TrackingClickParams,
  ) => void;
};

const trackingContext = createContext<TrackingContext | undefined>(undefined);

export default trackingContext;
