export type TrackType =
  | 'trackPage'
  | 'trackClick'
  | 'trackOrder'
  | 'trackEvent'
  | 'trackImpression'
  | 'trackClickImpression';

export interface IOvhAtInternetTrack {
  type: TrackType;
  data: any;
}
