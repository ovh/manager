export type TrackType =
  | 'trackPage'
  | 'trackClick'
  | 'trackEvent'
  | 'trackImpression'
  | 'trackClickImpression'
  | 'trackMVTest';

export interface LegacyTrackingData {
  name: string;
  chapter1?: string;
  chapter2?: string;
  chapter3?: string;
  level2: string;
  [key: string]: any;
}

export interface GenericTrackingData {
  country: string;
  website?: string;
  referrer?: string;
  full_url: string;
  site_name: string;
  user_agent: string;
  currency: string;
  event?: string;
  residential_country?: string;
  user_id: string;
  user_category: string;
  site_level2: string;
}

export interface PageTrackingData extends GenericTrackingData {
  page: string;
  page_chapter1: string;
  page_chapter2: string;
  page_chapter3: string;
}

export interface ClickTrackingData
  extends GenericTrackingData,
    PageTrackingData {
  click: string;
  click_chapter1: string;
  click_chapter2: string;
  click_chapter3: string;
}

export interface ImpressionTrackingData extends GenericTrackingData {
  onsitead_type: string;
  onsitead_campaign: string;
  onsitead_creation: string;
  onsitead_variant: string;
  onsitead_format: string;
  onsitead_general_placement: string;
  onsitead_detailed_placement: string;
  onsitead_advertiser: string;
  onsitead_url: string;
}

export type TrackingData = PageTrackingData | ClickTrackingData;

export interface IOvhAtInternetTrack {
  type: TrackType;
  data: LegacyTrackingData;
}
