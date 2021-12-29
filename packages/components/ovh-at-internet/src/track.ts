import { PageData } from './config';

export type TrackType =
  | 'trackPage'
  | 'trackClick'
  | 'trackOrder'
  | 'trackEvent'
  | 'trackImpression'
  | 'trackClickImpression';

export interface IOvhAtInternetTrack<T extends PageData> {
  type: TrackType;
  data: T;
}
