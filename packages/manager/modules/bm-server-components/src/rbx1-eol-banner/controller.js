import { GUIDE_LINKS, TRACKING_CONTEXT, TRACKING_OPTIONS } from './constants';

export default class RbxEolBannerController {
  /* @ngInject */
  constructor(atInternet, coreConfig) {
    this.atInternet = atInternet;
    this.TRACKING_CONTEXT = TRACKING_CONTEXT;
    this.TRACKING_OPTIONS = TRACKING_OPTIONS;
    this.guideLink =
      GUIDE_LINKS[coreConfig.getUser().ovhSubsidiary] || GUIDE_LINKS.DEFAULT;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: TRACKING_OPTIONS.trackingPageLabel,
      type: 'navigation',
      ...TRACKING_CONTEXT,
    });
  }
}
