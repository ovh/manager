import {
  ButtonType,
  PageLocation,
  PageName,
  PageType,
  TrackingClickParams,
} from '@/utils/tracking';

export const sharedTrackingParams: TrackingClickParams = {
  pageName: PageName.associate,
  pageType: PageType.popup,
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};
