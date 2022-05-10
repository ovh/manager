import { MVTestingData, PageData } from './config';

export type TrackType =
  | 'trackPage'
  | 'trackClick'
  | 'trackOrder'
  | 'trackEvent'
  | 'trackImpression'
  | 'trackClickImpression'
  | 'trackMVTest';

export type AtInternetTrackData<T> = T extends PageData ? T : MVTestingData;

export interface IOvhAtInternetTrack<T> {
  type: TrackType;
  data: AtInternetTrackData<T>;
}
